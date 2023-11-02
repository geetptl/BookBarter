// id SERIAL PRIMARY KEY,
// created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
// last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
// req_id INTEGER REFERENCES request(id),
// amount DECIMAL(10, 2),
// txn_id TEXT UNIQUE,
// payment_status TEXT
// );

const express = require("express");
const paymentService = require("../services/payment");
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.get("/test", async (req, res) => {
    res.status(200).send("Test working");
});

router.post('/saveCard', async (req, res) => {
    try {
      const { email, card } = req.body;
  
      // Create a customer
      const customer = await stripe.customers.create({
        email,
        source: card.token, // Assuming you're sending a card token
      });
  
      // Save the customer ID for later use
      // You can store it in your database associated with the user's account
  
      res.json({ customerId: customer.id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

router.get('/getCards/:customerId', async (req, res) => {

try {
  const { customerId } = req.params;

  // Retrieve the customer's saved cards
  const cards = await stripe.customers.listSources(
    customerId,
    { object: 'card', limit: 10 }
  );

  // Format and send the card information
  const formattedCards = cards.data.map(card => ({
    last4: card.last4,
    brand: card.brand,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
  }));

  res.json(formattedCards);
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
}
});

router.post('/createPaymentIntent', async (req, res) => {
try {
const { amount, currency } = req.body;
const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
res.json({ clientSecret: paymentIntent.client_secret });
} catch (error) {
console.error(error);
res.status(500).send('Internal Server Error');
}
});

module.exports = router;