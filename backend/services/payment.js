const db = require("../db");
const user = require("./user")
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to insert a new card
async function addCard(email, customerId, userId, paymentMethodId) {
  
  // const payerId = await user.getUserIdfromEmail(email);
  // console.log(payerId, "payerid")
  const query = 'INSERT INTO cards(payer_id, stripe_customer_id, payment_method_id) VALUES($1, $2, $3) RETURNING id';
  const values = [userId, customerId, paymentMethodId];
  try {
    const result = await db.query(query, values);
    console.log(query);
    if (result.rowCount === 1) {
      console.log("Card was saved successfully.");
      return true;
  } else {
      console.log("Failed to insert into cards.");
      return false;
  }
  } catch (err) {
    throw err;
  }
}
async function getCardDetailsByUserId(userId) {
  try {
    const queryString = 'SELECT stripe_customer_id FROM cards WHERE payer_id = $1';
    const params = [userId];
    const result = await db.query(queryString, params);
    if (result.rows.length > 0) {
      console.log(result.rows[0])
      return result.rows[0].stripe_customer_id; // returns the first card found for simplicity
    } else {
      return null; // no card found
    }
  } catch (error) {
    console.error("Error fetching card details:", error);
    throw error;
  }
}


async function makePayment(amount, currency) {

  // Create a Payment Intent: this will handle the payment process
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount, // Amount is in cents (e.g., 10 dollars = 1000 cents)
  //   currency, // 'usd', 'eur', etc.
  //   customer: customerId, // This should be the Stripe Customer ID
  //   payment_method: payment_method_id, // This should be the ID of the payment method to charge
  //   off_session: true, // Set this to true if the customer is not present during payment
  //   confirm: true, // This will confirm the payment at the same time
  //   description, // Optional: Description of the payment
  // });

  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount,
  //   currency,
  //   payment_method_types: ['card'],
  //   metadata: { integration_check: 'accept_a_payment' },
  // });
  return "DummyPaymentIntent";
}


module.exports = { addCard, makePayment, getCardDetailsByUserId};
