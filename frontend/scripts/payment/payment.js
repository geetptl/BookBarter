
function handlePaymentApprove(requestId) {

    // Display the modal
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.style.display = 'block';
    document.getElementById('requestId').value = requestId;

    // Now, start the card checking process
    getUserCards(requestId);
    
  // window.location.href = `../../templates/payment/pay.html?requestId=${requestId}`;
}

function getUserCards(requestId) {

    fetch(`http://localhost:8000/requests/getBorrowerIdFromRequestId/${requestId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["status"] === "Success") {
            fetch(`http://localhost:8000/payment/getCards/${data["borrowerId"]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            })
            .then(response => response.json())
            .then(dataCards => {
                const modalContent = document.getElementById('paymentModalContent'); // Make sure this ID matches your modal content div
                if (dataCards.hasCard) {
                    const confirmPaymentElement = document.getElementById('confirm-payment');
                    confirmPaymentElement.removeAttribute('hidden');
                    console.log("your cardDetails ",  dataCards.cardDetails )
                    document.getElementById('customerId').value = dataCards.customerId;
                    document.getElementById('paymentMethodId').value = dataCards.paymentMethods;
                    document.getElementById('card-last4').textContent = `**** **** **** ${dataCards.cardDetails.last4}`;
                    document.getElementById('card-expiry').textContent = `${dataCards.cardDetails.exp_month}/${dataCards.cardDetails.exp_year}`;
               
                } else {
                    const addCardElement = document.getElementById('add-card');
                    addCardElement.removeAttribute('hidden');
                }
                const userIdElement = document.getElementById("userId");
                userIdElement.textContent = data["borrowerId"];
            })
            .catch(console.error);
        } else {
            modalContent.innerHTML = `<p>${data.message || "Error approving the request."}</p>`; // Display error message in modal
        }
    })
    .catch(console.error);
}

document.addEventListener("DOMContentLoaded", () => {
    const stripe = Stripe('pk_test_51O7q8CJvFHmzlX92OVAQU6H0GFuN5tiUGEdOy4bNFa4hWbTWEPFA4YFMQl1Pye6FkFkl0npuYAUyPZFmMzgzau6o00uSYykKHk');
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    card.addEventListener('change', ({error}) => {
        const displayError = document.getElementById('error-message');
        displayError.textContent = error ? error.message : '';
    });
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        handleCardSubmission(stripe, elements);
    });

    const payButton = document.getElementById('pay-now-button');
    payButton.addEventListener('click', handlePayment);

    // Close button functionality
    const closeButton = document.querySelector('.close');
    const paymentModal = document.getElementById('paymentModal');

    closeButton.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
})

async function handleCardSubmission(stripe, elements) {
    const email = document.getElementById('email').value;
    const userId = document.getElementById('userId').textContent;
    const cardElement = elements.getElement('card');
    
    try {
        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: { email: email }
        });

        if (error) {
            document.getElementById('error-message').textContent = error.message;
        } else {
            await saveCardDetails(email, paymentMethod.id, userId);
        }
    } catch (error) {
        console.error('Error in card submission (createPaymentMethod):', error);
        alert('Error processing card details. Please try again.');
    }
}

async function saveCardDetails(email, paymentMethodId, userId) {
    try {
        const response = await fetch('http://localhost:8000/payment/card/add', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' ,
                'authorization': `${token}`
            },
            body: JSON.stringify({ email, paymentMethodId, userId })
        });

        const data = await response.json();
        console.log("this the card that you saved: ", data);
        //alert('Card saved successfully!');
        // Update the modal content after successful card saving
        const addCardElement = document.getElementById('add-card');
        addCardElement.setAttribute('hidden', true); // Hide add card section

        const confirmPaymentElement = document.getElementById('confirm-payment');
        confirmPaymentElement.removeAttribute('hidden'); // Show confirm payment section

        // Optionally, update card info in the confirm-payment element
        // Assuming data.cards contains the card details
        if (data.cardDetails ) {
            console.log("your cardDetails ",  data.cardDetails )
            const cardDetails = data.cardDetails; // Assuming first card is the one to show
            document.getElementById('card-last4').textContent = `**** **** **** ${cardDetails.last4}`;
            document.getElementById('card-expiry').textContent = `${cardDetails.exp_month}/${cardDetails.exp_year}`;

            document.getElementById('customerId').value = data.customerId;
            document.getElementById('paymentMethodId').value = data.paymentMethodId;
                    
        }
    } catch (error) {
        console.error('Error saving the card:', error);
        alert('Error saving the card. Please try again.');
    }
}

async function handlePayment(event) {
    event.preventDefault();

    const customerId = document.getElementById('customerId').value;
    const paymentMethodId = document.getElementById('paymentMethodId').value;
    const amount = parseInt(document.getElementById('amount').value * 100); 
    const currency = 'usd'; // Assuming currency is USD
    const description = "Book purchase";

    try {
        const requestId = document.getElementById('requestId').value;

        const response = await fetch('http://localhost:8000/payment/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                customerId: customerId,
                payment_method_id: paymentMethodId,
                description: description,
                requestId: requestId
            }),
        });

        const data = await response.json();

        if (data.status === 'Success') {
            // Hide the payment confirmation elements
            const confirmPaymentElement = document.getElementById('confirm-payment');
            confirmPaymentElement.setAttribute('hidden', true);

            // Update modal with success message and show the "Okay" button
            const modalMessages = document.getElementById('modal-messages');
            modalMessages.innerHTML = '<p>Your Payment for request_details has been received successfully.</p>';

            const okButton = document.getElementById('ok-button');
            okButton.style.display = 'block';
            okButton.addEventListener('click', () => {
                const paymentModal = document.getElementById('paymentModal');
                paymentModal.style.display = 'none';
            });
        } else {
            throw new Error(data.error.message || 'Payment failed');
        }
    } catch (error) {
        console.error('Payment failed:', error);
        const modalMessages = document.getElementById('modal-messages');
        modalMessages.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

