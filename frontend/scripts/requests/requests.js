
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
        return data[0].title; // Assuming the API returns an object with a BookName property
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
                if(act.status === "Pending"){
                    const actionDiv = document.createElement("div");
                    actionDiv.className = "action-card";
                    const userName = await getUserNameFromIdAPI(act.borrower_id);
                    const bookName = await getBookNameFromListingIdAPI(act.book_listing_id);
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <h3>Borrow request for the book: ${bookName}</h3>
                            <div class="action-cards-controls">
                                <button data-id="${act.id}" class="btn approve-request-btn">Approve</button>
                                <button data-id="${act.id}" class="btn reject-request-btn">Reject</button>
                            </div>
                        </div>
                        <span>Borrower: ${userName}</span>
                    `;
                    actionsDiv.appendChild(actionDiv);
                }
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
                        <div class="action-card-left">
                            <h3>Your request for ${bookName} accepted!</h3>
                            <div class="action-cards-controls">
                                <button data-id="${act.id}" class="btn pymt-approve-btn">Make Payment</button>
                                <button data-id="${act.id}" class="btn pymt-decline-btn">Decline Payment</button>
                            </div>
                        </div>
                        <span>Lender: ${userName}</span>
                    `;
                    actionsDiv.appendChild(actionDiv);

                }
                if(act.status === "Rejected"){
                    const actionDiv = document.createElement("div");
                    actionDiv.className = "action-card";
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                        <h3>Your request for ${bookName} was rejected.</h3>
                        <button data-id="${act.id}" class="btn req-close-btn">Close Request</button>
                        </div>
                        <span class="lender-id">Lender: ${userName}</span>
                    `;
                    actionsDiv.appendChild(actionDiv);

                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const actionsDiv = document.getElementById("pending-actions");

    // Use event delegation to capture click events on the actionsDiv
    actionsDiv.addEventListener("click", event => {
        const target = event.target;
        if (target.classList.contains("approve-request-btn")) {
            handleApprove(target.getAttribute("data-id"));
        } else if (target.classList.contains("reject-request-btn")) {
            handleReject(target.getAttribute("data-id"));
        } else if (target.classList.contains("pymt-approve-btn")) {
            handlePaymentApprove(target.getAttribute("data-id"));
        } else if (target.classList.contains("pymt-decline-btn")) {
            handlePaymentDecline(target.getAttribute("data-id"));
        } else if (target.classList.contains("req-close-btn")) {
            handleRequestClose(target.getAttribute("data-id"));
        }
    });
});

function handleRequestClose(requestId) {
    fetch(`http://localhost:8000/requests/setStatusToExpired`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["Request close status"] == "Success") {
            alert("Request closed successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error approving the request.");
        }
    })
    .catch(console.error);
}

function handleApprove(requestId) {
    console.log("here!!")
    fetch(`http://localhost:8000/requests/approveRequest`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["Request approval status"] == "Success") {
            alert("Request approved successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error approving the request.");
        }
    })
    .catch(console.error);
}
    

function handleReject(requestId) {
    fetch(`http://localhost:8000/requests/rejectRequest`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["Request rejection status"] == "Success") {
            alert("Request rejected successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error rejecting the request.");
        }
    })
    .catch(console.error);
}

function handlePaymentApprove(requestId) {
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
        if (data) {
            fetch(`http://localhost:8000/payment/getCards/${data["borrowerId"]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Check if user has a card
                if (data.hasCard) {
                    // Redirect to payment page
                    window.location.href = 'http://localhost:8000/payment/pay'; // TODO: Update with actual payment page URL
                } else {
                    // Redirect to add card page or display message
                    alert(data.message);
                    window.location.href = '../../templates/payment/addCard.html'; // Update with actual add card page URL
                }
                }
            )
            .catch(console.error);
        } else {
            alert(data.message || "Error approving the request.");
        }
    })
    .catch(console.error);
}

function handlePaymentDecline(requestId) {
    // Mansi
    fetch(`http://localhost:8000/requests/rejectRequest`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["Request rejection status"] == "Success") {
            alert("Request rejected successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error rejecting the request.");
        }
    })
    .catch(console.error);
}

