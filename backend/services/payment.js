const db = require("../db");
const user = require("./user");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to insert a new card
async function addCard(email, paymentMethodId, userId) {
    try {
        // Stripe logic to create customer and attach payment method
        let customer = await stripe.customers.list({ email, limit: 1 });
        if (customer.data.length === 0) {
            customer = await stripe.customers.create({
                email,
                payment_method: paymentMethodId,
            });
        } else {
            customer = customer.data[0];
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id,
            });
        }
        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Add card details to the database
        await addCardToDB(email, customer.id, userId, paymentMethodId);

        // Retrieve and format the card details
        const paymentMethod =
            await stripe.paymentMethods.retrieve(paymentMethodId);
        const cardDetails = formatCardDetails(paymentMethod);

        return {
            message: "Card added successfully",
            cardDetails: cardDetails,
            customerId: customer.id,
            paymentMethodId: paymentMethodId,
        };
    } catch (error) {
        console.error("Error in addCard:", error);
        throw error;
    }
}

async function addCardToDB(email, customerId, userId, paymentMethodId) {
    const query =
        "INSERT INTO cards (payer_id, stripe_customer_id, payment_method_id) VALUES ($1, $2, $3) RETURNING id";
    const values = [userId, customerId, paymentMethodId];

    try {
        const result = await db.query(query, values);
        if (result.length > 0) {
            console.log("Card was saved successfully with ID:", result[0].id);
            return result[0].id; // Return the ID of the newly added card
        } else {
            console.log("Failed to insert into cards.");
            return null; // Indicate failure
        }
    } catch (err) {
        console.error("Error in addCardToDB:", err);
        throw err;
    }
}

function formatCardDetails(paymentMethod) {
    // Extract the card details from the paymentMethod object
    const cardInfo = paymentMethod.card;

    // Format and return the necessary details
    return {
        last4: cardInfo.last4,
        brand: cardInfo.brand,
        exp_month: cardInfo.exp_month,
        exp_year: cardInfo.exp_year,
        // You can add more fields here if needed
    };
}
async function getCardDetailsByUserId(userId) {
    try {
        const queryString =
            "SELECT stripe_customer_id FROM cards WHERE payer_id = $1";
        const params = [userId];
        const result = await db.query(queryString, params);
        if (result.length > 0) {
            console.log(result[0]);
            return result[0].stripe_customer_id; // returns the first card found for simplicity
        } else {
            return null; // no card found
        }
    } catch (error) {
        console.error("Error fetching card details:", error);
        throw error;
    }
}

async function retrieveCards(customerId) {
    try {
        // Retrieve the customer's saved cards
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });

        // Format the card information
        if (paymentMethods.data.length > 0) {
            const formattedCards = paymentMethods.data.map((pm) => ({
                last4: pm.card.last4,
                brand: pm.card.brand,
                exp_month: pm.card.exp_month,
                exp_year: pm.card.exp_year,
            }));
            console.log(
                "paymentMethods.data.length , paymentMethods.data[0].id: ",
                paymentMethods.data.length,
                paymentMethods.data[0].id,
            );
            return {
                hasCard: true,
                cardDetails: formattedCards[0],
                customerId: customerId,
                paymentMethodId: paymentMethods.data[0].id, // Assuming we want the first card's payment method ID
            };
        } else {
            return {
                hasCard: false,
                message: "User has no card on file, please add a card.",
            };
        }
    } catch (error) {
        console.error("Error in retrieveCards:", error);
        throw error;
    }
}

async function makePaymentWithRecord(
    amount,
    currency,
    customerId,
    paymentMethodId,
    description,
    requestId,
) {
    try {
        // Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            confirm: true,
            description,
            return_url: "https://example.com/",
        });

        if (await setApprovePaymentStatus(requestId)) {
            // Add a payment record to the database
            const paymentRecord = await addPaymentRecord(
                requestId,
                amount,
                paymentIntent.id,
                "Success",
            );

            return {
                status: "Success",
                paymentIntentId: paymentIntent.id,
                paymentRecord: paymentRecord,
            };
        } else {
            console.error("Update request status failed:", error);
            throw new Error(
                "Unable to set Payment approved status. Please try again.",
            );
        }
    } catch (error) {
        console.error("Payment failed:", error);
        throw new Error("Payment failed. Please try again."); // Or handle the error as needed
    }
}

async function setApprovePaymentStatus(requestId) {
    try {
        const query = `
          UPDATE request
          SET status = 'PaymentApproved'
          WHERE id = ?
          RETURNING *;
      `;

        const values = [requestId];

        const result = await db.query(query, values);
        return result.length === 1;
    } catch (error) {
        console.error("Error in setApprovePaymentStatus request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function addPaymentRecord(
    req_id,
    amount,
    payment_intent_id,
    payment_status,
) {
    const query = `INSERT INTO payment (req_id, amount, payment_intent_id, payment_status) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [req_id, amount, payment_intent_id, payment_status];

    try {
        const result = await db.query(query, values);
        return result[0];
    } catch (err) {
        console.error("Error adding payment record:", err);
        throw err;
    }
}

module.exports = {
    addCard,
    makePaymentWithRecord,
    getCardDetailsByUserId,
    addPaymentRecord,
    retrieveCards,
};
