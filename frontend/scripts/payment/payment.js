window.onload = function () {
    
    getUserCards();

};

function getUserCards() {

    const requestId = document.getElementById('idContainer').textContent;

    // Mansi
    fetch(`http://localhost:8000/requests/getBorrowerIdFromRequestId/${requestId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data)  // DESMOND,FIX ME 
        if (data["status"] === "Success") {
            fetch(`http://localhost:8000/payment/getCards/${data["borrowerId"]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(dataCards => {
                // Check if user has a card
                if (dataCards.hasCard) {
                    // Redirect to payment page
                    // window.location.href = `http://localhost:8000/payment/pay`; // TODO: Update with actual payment page URL
                    // window.location.href = `../../templates/payment/addCard.html`
                    const confirmPaymentElement = document.getElementById('confirm-payment');
                    confirmPaymentElement.removeAttribute('hidden'); 
                    const cardElement = document.getElementById("card-details");
                    cardElement.textContent = JSON.stringify(dataCards["cards"][0]);
                } else {
                    // Redirect to add card page or display message
                    alert(dataCards.message);
                    // window.location.href = `../../templates/payment/addCard.html?userId=${data["borrowerId"]}`; // Update with actual add card page URL
                    // saveCard();
                    const addCardElement = document.getElementById('add-card');
                    addCardElement.removeAttribute('hidden'); 
                }
                const userIdElement = document.getElementById("user-id");
                userIdElement.textContent = data["borrowerId"];
                }
            )
            .catch(console.error);
        } else {
            alert(data.message || "Error approving the request.");
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
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const userId = document.getElementById('user-id').textContent;
        const cardElement = elements.getElement('card');
        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                email: email,
            },
        });

        if (error) {
            const errorElement = document.getElementById('error-message');
            errorElement.textContent = error.message;
        } else {
            fetch('http://localhost:8000/payment/card/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    paymentMethodId: paymentMethod.id,
                    userId: userId
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert('Card saved successfully!');
            })
            .catch(error => {
                console.error(error);
                alert('Error saving the card. Please try again.');
            });
        }
    });


    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const userId = document.getElementById('user-id').textContent;

        const card = JSON.parse(document.getElementById("card-details").textContent);

        fetch('http://localhost:8000/payment/card/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                amount: '2',
                currency: 'USD',
                description: "Book purchase",
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data["status"] == "Success")
            console.log(data);

            // MANSI, API CALL TO LOG THE PAYMENT SUCCESS
            // NEED TO DISCUSS HOW THE ACTUAL PAYMENT HAPPENS
            alert('Payment Success!');
        })
        .catch(error => {
            console.error(error);
            alert('Error saving the card. Please try again.');
        });
    
    });


    // const actionsDiv = document.getElementById("add-card");

    // // Use event delegation to capture click events on the actionsDiv
    // actionsDiv.addEventListener("click", event => {
    //     handleSaveCard();
    // });
});


function handleSaveCard() {
    
    
}

function removeCard() {
    // TODO:
}