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

router.post('/save-card', async (req, res) => {
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

  router.get('/get-cards/:customerId', async (req, res) => {
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
  
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// // Borrower requests an exchange
// router.post("/addCard", async (req, res) => {
//     try {
//         const borrowerId = req.body.borrowerId;
//         const borrowDuration = req.body.borrowDuration;
//         const listingId = req.body.listingId;

//         if(borrowerId === undefined || borrowDuration === undefined || listingId == undefined){
//             res.status(400).json({ "Request Raised": "Fail", "Failure Reason": "Invalid Parameters"}); // Status code 400 for bad request
//         }
//         else{
//             // Retrieve lender_id using the getLenderIdByListingId function
//             const lenderId = await requestService.getLenderIdByListingId(listingId);
//             console.log(lenderId)
//             if (lenderId !== null) {
//                 // Now, you have the lender_id, you can proceed to create the request
//                 const result = await requestService.raiseBorrowRequest(borrowerId, lenderId, listingId, borrowDuration);

//                 if (result) {
//                     res.status(200).json({ "Request Raised": "Success" }); // Status code 200 for success
//                 } else {
//                     res.status(400).json({ "Request Raised": "Fail", "Failure Reason": "Failed to create request due to server"}); // Status code 400 for bad request
//                 }
//             } else {
//                 res.status(404).json({ "Request Raised": "Listing not found" }); // Status code 404 for not found
//             }
//         }

//     } catch (error) {
//         console.error("Error while creating borrow request:", error);
//         res.status(500).json({ "Error": "Internal Server Error" }); // Status code 500 for internal server error
//     }
// });


module.exports = router;