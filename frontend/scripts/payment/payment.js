window.onload = function () {

    saveCard();

};

function saveCard() {
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
                paymentMethodId: paymentMethod.id
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
}

function removeCard() {
    // TODO:
}