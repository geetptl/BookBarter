window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        fetch(`http://localhost:8000/book/get/${bookId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then(bookDetails => displayBookDetails(bookDetails))
    .catch(console.error);
    }
    else{
        console.error('Book ID not found')
    }  
};


function displayBookDetails(bookDetails) {
    const booklistingDiv = document.getElementById("book-details");
    const bookAuthor = bookDetails.book.author;
    const bookImg = bookDetails.book.image_url;
    const bookGenre = bookDetails.book.genre;
    booklistingDiv.innerHTML = "";
    const bookInfo = document.createElement("div");
    bookInfo.innerHTML = `
    <div style="display: flex; align-items: flex-start;">
        <img src="${bookDetails.book.image_url}" style="height: 250px; width: 250px; margin-right: 20px;" alt="${bookDetails.book.title}">
        <span>
            <h3>${bookDetails.book.title}</h3>
            <p><strong>Author: </strong>${bookDetails.book.author}</p>
            <p><strong>Rating: </strong>${bookDetails.book.rating}</p>
            <p><strong>Description: </strong>${bookDetails.book.description}</p>
            
        </span>
    </div>
    `
    booklistingDiv.appendChild(bookInfo);
    
    bookDetails.users.forEach((user) => {
        //usersListHTML += `<li>${user.first_name} ${user.last_name} - ${user.email}</li>`;
        const actionDiv = document.createElement("div");
        actionDiv.className = "action-card";
        //const userName = await getUserNameFromIdAPI(act.borrower_id);
        //const bookName = await getBookNameFromListingIdAPI(act.book_listing_id);
            
        actionDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>User ${user.user_id} has book Available</h4>
                <button data-id="${user.id}" class="btn approve-request-btn">Raise Request</button>
            </div>
        `;

        booklistingDiv.appendChild(actionDiv);
        const requestButton = actionDiv.querySelector('.approve-request-btn');
        requestButton.addEventListener('click', function() {
        raiseRequest(user.id, user.listing_id); // Pass the user ID and the book ID to the raiseRequest function
        });
    });
}

function raiseRequest(userId, listingId) {
    console.log(userId, listingId);
    const url = 'http://localhost:8000/requests/raiseBorrowRequest';
    const data = {
        borrowerId: userId, 
        borrowDuration: "5",
        listingId: listingId
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonResponse => {
        console.log('Request creation success:', jsonResponse);
        alert("Request is raised successfully!"); // Show an alert for successful request
    })
    .catch(error => {
        console.error('Request creation failed:', error);
        alert("There was an error raising the request."); // Show an alert for a failed request
    });
}

function requestBook(userId) {
    console.log(`Requesting book from user with ID: ${userId}`);
}
