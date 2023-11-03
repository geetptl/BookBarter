const db = require("../db");
const user = require("./user")
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to insert a new card
async function addCard(email, paymentMethodId) {
  
  const payerId = await user.getUserIdfromEmail(email);
  console.log(payerId, "payerid")
  const query = 'INSERT INTO cards(payer_id, stripe_customer_id) VALUES($1, $2) RETURNING id';
  const values = [payerId, paymentMethodId];
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

async function createPaymentIntent(amount, currency) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
    metadata: { integration_check: 'accept_a_payment' },
  });
  return paymentIntent;
}


module.exports = { addCard, createPaymentIntent, getCardDetailsByUserId};
