const express = require("express");
const paymentService = require("../services/payment");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.get('/test', async (req, res) => {
    res.status(200).send("Test working");
});

router.post('/card/add', requireAuth, async (req, res) => {
    try {
        const { email, paymentMethodId, userId } = req.body;
        const addCardResponse = await paymentService.addCard(email, paymentMethodId, userId);

        res.json(addCardResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/getCards/:borrowerId", requireAuth, async (req, res) => {
    try {
      const borrowerId = req.params.borrowerId;
      const customerId = await paymentService.getCardDetailsByUserId(borrowerId);
  
      if (!customerId) {
        return res.status(200).json({
          hasCard: false,
          message: "User has no card on file, please add a card."
        });
      }
  
      const cardDetails = await paymentService.retrieveCards(customerId);
      res.status(200).json(cardDetails);
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  });
  



  router.post('/pay', requireAuth, async (req, res) => {
    try {
      const { amount, currency, customerId, description, payment_method_id, requestId } = req.body;
  
      const result = await paymentService.makePaymentWithRecord(
        amount,
        currency,
        customerId,
        payment_method_id,
        description,
        requestId
      );
  
      // Respond based on the result of the payment process
      if (result.status === 'Success') {
        res.json({
          status: 'Success',
          paymentIntentId: result.paymentIntentId,
          paymentRecord: result.paymentRecord
        });
      } else {
        res.status(500).json({
          status: 'Failure',
          error: "Payment processing failed."
        });
      }
    } catch (error) {
      console.error('Payment failed:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

module.exports = router;