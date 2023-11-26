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
        const {
            email,
            paymentMethodId,
            userId
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
        console.log(email, customer.id, userId, paymentMethodId);
        const cardId = await paymentService.addCard(email, customer.id, userId, paymentMethodId);

        // Retrieve the card details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // Format the response
        const cardDetails = {
            last4: paymentMethod.card.last4,
            brand: paymentMethod.card.brand,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year
        };

        res.json({
            message: 'Card added successfully',
            cardDetails: cardDetails,
            customerId: customer.id,
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
          // Check if there are any payment methods
          console.log("paymentMethods.data.length , paymentMethods.data[0].id: ", paymentMethods.data.length , paymentMethods.data[0].id)
          // User has a card, redirect to payment (or return success response to frontend to handle the redirection)
          res.status(200).json({
              hasCard: true,
              cardDetails:formattedCards[0],
              customerId:customerId,
              paymentMethods: paymentMethods.data[0].id
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
        requestId 
      } = req.body;
      


      const result = await paymentService.makePayment(
        amount,
        currency,
        customerId,
        payment_method_id,
        description
        )
      
  
      // If the payment intent is successful, you can send back any information needed to the client
      if (result.status === 'Success') {
        console.log(requestId, amount, result.paymentIntentId, 'Success')
        const paymentRecord = await paymentService.addPaymentRecord(requestId, amount, result.paymentIntentId, 'Success');
        console.log('Payment Record Added:', paymentRecord);

        res.json({
            status: 'Success',
            paymentIntentId: result.paymentIntentId,
            paymentRecord: paymentRecord // Optionally send back payment record details
        });
      } else {
        console.error('Payment failed:', result.error);
        res.status(500).json({
          status: 'Failure',
          error: result.error.message
        });
      }
    } catch (error) {
      console.error('Payment failed:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

module.exports = router;