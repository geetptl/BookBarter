
window.onload = function () {
    const userId = '1'; // This should be fetched dynamically based on the logged-in user.
    fetch(`http://localhost:8000/requests/getPendingActions/${userId}`, {
        method: 'GET',
        // body: JSON.stringify({ userId: userId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(displayPendingActions)
    .catch(console.error);
    saveCard();

};

async function getUserNameFromIdAPI(userId) {
    const apiUrl = `http://localhost:8000/user/getUserName/${userId}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data["User ID"].user_id; // Assuming the API returns an object with a userName property
    } catch (error) {
        console.error("Error fetching user name:", error);
        return "N/A"; // Return a default value or handle the error as needed
    }
}

async function getBookNameFromListingIdAPI(listingId) {
    const apiUrl = `http://localhost:8000/booklisting/getBookName/${listingId}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data.title; // Assuming the API returns an object with a BookName property
    } catch (error) {
        console.error("Error fetching book name:", error);
        return "N/A"; // Return a default value or handle the error as needed
    }
}


function displayPendingActions(actions) {
    const actionsDiv = document.getElementById("pending-actions");
    actionsDiv.innerHTML = "";
    actions.Requests.forEach(action => {
        if("asLender" in action){
            action.asLender.forEach(async act => {
                const actionDiv = document.createElement("div");
                actionDiv.className = "action-card";
                const userName = await getUserNameFromIdAPI(act.lender_id);
                const bookName = await getBookNameFromListingIdAPI(act.book_listing_id);
                actionDiv.innerHTML = `
                    <h3>Borrow request for the book: ${bookName} from ${userName}</h3>
                    <!-- ... (display other action details as desired) ... -->
                    <button data-id="${act.book_listing_id}" class="btn btn-primary approve-btn">Approve</button>
                    <button data-id="${act.status}" class="btn btn-danger reject-btn">Reject</button>
                `;
                actionsDiv.appendChild(actionDiv);
            });
        }

        if("asBorrower" in action){
            action.asBorrower.forEach(async act => {
                const userName = await getUserNameFromIdAPI(act.lender_id);
                const bookName = await getBookNameFromListingIdAPI(act.book_listing_id);

                if(act.status === "Accepted"){
                    const actionDiv = document.createElement("div");
                    actionDiv.className = "action-card";
                    actionDiv.innerHTML = `
                        <h3>Borrow request accepted by ${userName} for the book: ${bookName}</h3>
                        <!-- ... (display other action details as desired) ... -->
                        <button data-id="${act.book_listing_id}" class="btn btn-primary approve-btn">Make Payment</button>
                        <button data-id="${act.status}" class="btn btn-danger reject-btn">Decline Payment</button>
                    `;
                    actionsDiv.appendChild(actionDiv);

                }
                if(act.status === "Rejected"){
                    const actionDiv = document.createElement("div");
                    actionDiv.className = "action-card";
                    actionDiv.innerHTML = `
                        <h3>Borrow request rejected by ${userName} for the book: ${bookName}</h3>
                        <!-- ... (display other action details as desired) ... -->
                        <button data-id="${act.status}" class="btn btn-primary reject-btn">Okay</button>
                    `;
                    actionsDiv.appendChild(actionDiv);

                }
            });
        }
    });

    // Set event listeners for the approve and reject buttons
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", handleApprove);
    });
    document.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", handleReject);
    });
}

function handleApprove(event) {
    const requestId = event.target.getAttribute("data-id");
    fetch(`http://localhost:8000/approveRequest`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Request approved successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error approving the request.");
        }
    })
    .catch(console.error);
}

function handleReject(event) {
    const requestId = event.target.getAttribute("data-id");
    fetch(`http://localhost:8000/rejectRequest`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Request rejected successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error rejecting the request.");
        }
    })
    .catch(console.error);
}

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
        const {token, error} = await stripe.createToken(card);

        if (error) {
            const errorElement = document.getElementById('error-message');
            errorElement.textContent = error.message;
        } else if (!email) {
            const errorElement = document.getElementById('error-message');
            errorElement.textContent = 'Email is required';
        } else {
            fetch('http://localhost:8000/payment/saveCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, card: {token: token.id}}),
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

