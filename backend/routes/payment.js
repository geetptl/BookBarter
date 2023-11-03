const express = require("express");
const paymentService = require("../services/payment");
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.get('/test', async (req, res) => {
    res.status(200).send("Test working");
});

router.post('/card/add', async (req, res) => {
    try {
        const {
            email,
            paymentMethodId
        } = req.body;
        console.log("paymentMethodId", paymentMethodId)
        // Look up or create a customer based on the email address
        let customer = await stripe.customers.list({
            email: email,
            limit: 1
        });
        if (customer.data.length === 0) {
            customer = await stripe.customers.create({
                email: email,
                payment_method: paymentMethodId,
            });
        } else {
            customer = customer.data[0];
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id,
            });
        }

        // Set the PaymentMethod as default for the customer
        await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        const cardId = await paymentService.addCard(email, customer.id);

        res.json({
            customerId: customer.id,
            /*cardId: cardId ,*/
            paymentMethodId: paymentMethodId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/getCards/:borrowerId", async (req, res) => {
  try {
      const borrowerId = req.params.borrowerId
      const customerId = await paymentService.getCardDetailsByUserId(borrowerId);
      console.log("customerId is",customerId)
      if (customerId) {
          // Retrieve the customer's saved cards
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
          });
          console.log(paymentMethods)
          // Format and send the card information
          const formattedCards = paymentMethods.data.map(pm => ({
            last4: pm.card.last4,
            brand: pm.card.brand,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
          }));
          console.log(formattedCards)
          // User has a card, redirect to payment (or return success response to frontend to handle the redirection)
          res.status(200).json({
              "hasCard": true,
              "cards":formattedCards
              // Include any other data needed for payment processing
          });
      } else {
          // User does not have a card, handle accordingly, perhaps redirect to add card page
          res.status(200).json({
              "hasCard": false,
              "message": "User has no card on file, please add a card."
          });
      }
  } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({
          "Request Approved": "Error"
      });
  }
});

router.post('/pay', async (req, res) => {
    try {
      const {
        amount,
        currency,
        customerId,
        description,
        payment_method_id, 
      } = req.body;
  
      // Create a Payment Intent: this will handle the payment process
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount is in cents (e.g., 10 dollars = 1000 cents)
        currency, // 'usd', 'eur', etc.
        customer: customerId, // This should be the Stripe Customer ID
        payment_method: payment_method_id, // This should be the ID of the payment method to charge
        off_session: true, // Set this to true if the customer is not present during payment
        confirm: true, // This will confirm the payment at the same time
        description, // Optional: Description of the payment
      });
  
      // If the payment intent is successful, you can send back any information needed to the client
      res.json({
        message: 'Payment successful',
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Payment failed:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;