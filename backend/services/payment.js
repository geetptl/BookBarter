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

// async function addCard(userId, , listingId, borrowDuration) {
//     try {
//         // Use placeholders to prevent SQL injection
//         const query = `
//             INSERT INTO request (borrower_id, lender_id, book_listing_id, time_to_live, status)
//             VALUES ($1, $2, $3, NOW() + INTERVAL '2 days', 'Pending', 0)
//         `;
        
//         const values = [borrowerId, lenderId, listingId];
//         console.log("dfdfsfd")
//         // Execute the query
//         const result = await db.query(query, values);
//         console.log(query)
//         if (result.rowCount === 1) {
//             console.log("Request created successfully.");
//             return true;
//         } else {
//             console.log("Failed to create request.");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error creating request:", error);
//         throw error; // Re-throw the error to handle it at a higher level if needed.
//     }
// }