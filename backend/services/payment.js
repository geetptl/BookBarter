const db = require("../db");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// id SERIAL PRIMARY KEY,
// created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
// last_updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
// req_id INTEGER REFERENCES request(id),
// amount DECIMAL(10, 2),
// txn_id TEXT UNIQUE,
// payment_status TEXT
// );


async function createPaymentIntent(amount, currency) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
    metadata: { integration_check: 'accept_a_payment' },
  });
  return paymentIntent;
}


module.exports = { createPaymentIntent };
