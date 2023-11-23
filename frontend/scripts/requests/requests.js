
let currentActions = {}; // Object to track the current state of actions

function fetchPendingActions() {
    const userId = '1'; // This should be dynamically fetched based on the logged-in user.
    fetch(`http://localhost:8000/requests/getPendingActions/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => updatePendingActions(data.Actions))
    .catch(console.error);
}

function invalidateOldRequests() {
    const userId = '1'; // This should be dynamically fetched based on the logged-in user.
    fetch(`http://localhost:8000/requests/invalidateOldRequests`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(console.error);
}

window.onload = function () {
    fetchPendingActions();
    setInterval(invalidateOldRequests, 10000); // Poll every 10 seconds
    setInterval(fetchPendingActions, 10000); // Poll every 10 seconds
};

async function updatePendingActions(newActions) {
    const actionsDiv = document.getElementById("pending-actions");

    for (const action of newActions) {
        // Simplified example, assuming each action has a unique ID
        const actionId = action.id;

        // Check if the action has changed since the last update
        if (!currentActions[actionId] || JSON.stringify(currentActions[actionId]) !== JSON.stringify(action)) {
            currentActions[actionId] = action; // Update the current state

            let actionDiv = document.getElementById(`action-${actionId}`);
            if (!actionDiv) {
                actionDiv = document.createElement("div");
                actionDiv.id = `action-${actionId}`;
                actionDiv.className = "action-card";
                // actionsDiv.appendChild(actionDiv);
            }

            // Update the innerHTML of the actionDiv based on the action details
            // Example: actionDiv.innerHTML = `<h3>${action.title}</h3>`;
            // You'll need to adapt this part to your specific data structure

            if (action["userType"] === "Lender") {
                if (action.status === "Pending") {
                    const userName = await getUserNameFromIdAPI(action.borrower_id);
                    const bookName = await getBookNameFromListingIdAPI(action.book_listing_id);
                    // const actionDiv = document.createElement("div");
                    // actionDiv.className = "action-card";
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <span>
                                <h3>Borrow request for the book: "<i class="book-name">${bookName}</i>"</h3>
                                <span>Borrower: ${userName}</span>
                            </span>
                            <div class="action-cards-controls">
                                <button data-id="${action.id}" class="btn approve-request-btn">Approve</button>
                                <button data-id="${action.id}" class="btn reject-request-btn">Reject</button>
                            </div>
                        </div>
                    `;
                    
                    actionsDiv.appendChild(actionDiv);
                }
            }
    
            if (action["userType"] === "Borrower") {
                const userName = await getUserNameFromIdAPI(action.lender_id);
                const bookName = await getBookNameFromListingIdAPI(action.book_listing_id);
                // const actionDiv = document.createElement("div");
                // actionDiv.className = "action-card";
                if (action.status === "Accepted") {
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <span>
                                <h3>Your request for "<i class="book-name">${bookName}</i>" accepted!</h3>
                                <span>Lender: ${userName}</span>
                            </span>
                            <div class="action-cards-controls">
                                <button data-id="${action.id}" class="btn pymt-approve-btn">Make Payment</button>
                                <button data-id="${action.id}" class="btn pymt-decline-btn">Decline Payment</button>
                            </div>
                        </div>
                    `;
                }
                if (action.status === "Rejected") {
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <span>
                                <h3>Your request for "<i class="book-name">${bookName}</i>" was rejected.</h3>
                                <span class="lender-id">Lender: ${userName}</span>
                            </span>
                            <div class="action-cards-controls">
                                <button data-id="${action.id}" class="btn req-close-btn">Close Request</button>
                            </div>
                        </div>
                    `;
                }
                if (action.status === "Pending") {
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <span>
                                <h3>Your request for "<i class="book-name">${bookName}</i>" is still awaiting lender's decision.</h3>
                                <span class="lender-id">Lender: ${userName}</span>
                            </span>
                        </div>
                    `;
                }
                if (action.status === "PaymentDeclined") {
                    actionDiv.innerHTML = `
                        <div class="action-card-left">
                            <span>
                                <h3>You declined payment for "<i class="book-name">${bookName}</i>".</h3>
                                <span class="lender-id">Lender: ${userName}</span>
                            </span>
                            <div class="action-cards-controls">
                                <button data-id="${action.id}" class="btn req-close-btn">Close Request</button>
                            </div>
                        </div>
                    `;
                }
                actionsDiv.appendChild(actionDiv);
            }
        }
    }

    // Optional: Remove actions that no longer exist
    for (const id in currentActions) {
        if (!newActions.find(action => action.id === parseInt(id))) {
            const actionDiv = document.getElementById(`action-${id}`);
            if (actionDiv) {
                actionsDiv.removeChild(actionDiv);
            }
            delete currentActions[id]; // Remove from current state
        }
    }
}

// Rest of your functions...

async function getUserNameFromIdAPI(userId) {
    const apiUrl = `http://localhost:8000/user/getUserName/${userId}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data["User ID"].user_id;
    } catch (error) {
        console.error("Error fetching user name:", error);
        return "N/A";
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
        return data[0].title;
    } catch (error) {
        console.error("Error fetching book name:", error);
        return "N/A";
    }
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
        if (data["status"] == "Success") {
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
        if (data["status"] == "Success") {
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
        if (data["status"] == "Success") {
            alert("Request rejected successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error rejecting the request.");
        }
    })
    .catch(console.error);
}

function handlePaymentApprove(requestId) {

    window.location.href = `../../templates/payment/pay.html?requestId=${requestId}`;
    // // Mansi
    // fetch(`http://localhost:8000/requests/getBorrowerIdFromRequestId/${requestId}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // console.log(data)  // DESMOND,FIX ME 
    //     if (data["status"] === "Success") {
    //         fetch(`http://localhost:8000/payment/getCards/${data["borrowerId"]}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             // Check if user has a card
    //             if (data.hasCard) {
    //                 // Redirect to payment page
    //                 // window.location.href = `http://localhost:8000/payment/pay`; // TODO: Update with actual payment page URL
    //                 window.location.href = `../../templates/payment/addCard.html`
    //             } else {
    //                 // Redirect to add card page or display message
    //                 alert(data.message);
    //                 window.location.href = `../../templates/payment/addCard.html?userId=${data["borrowerId"]}`; // Update with actual add card page URL
    //             }
    //             }
    //         )
    //         .catch(console.error);
    //     } else {
    //         alert(data.message || "Error approving the request.");
    //     }
    // })
    // .catch(console.error);
}

function handlePaymentDecline(requestId) {
    // Mansi
    fetch(`http://localhost:8000/requests/declinePayment`, {
        method: 'PUT',
        body: JSON.stringify({ requestId: requestId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data["status"] == "Success") {
            alert("Payment request declined successfully.");
            window.location.reload(); // Refresh the page to reflect the changes
        } else {
            alert(data.message || "Error declining the payment request.");
        }
    })
    .catch(console.error);
}

