window.onload = function () {
    const tempbookId = document.getElementById('idContainer');
    
    const bookId = tempbookId.textContent;
    console.log(bookId);
    if(bookId){
        fetch(`http://localhost:8000/book/get/${bookId}`, {
        method: 'GET',
        // body: JSON.stringify({ userId: userId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then(bookDetails => displayBookDetails(bookDetails))
    //.then(bookDetails => displayBooks(bookDetails))
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
            <h5>${bookDetails.book.title}</h5>
            <p><strong>Author: </strong>${bookDetails.book.author}</p>
            
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
            requestBtn.addEventListener('click', function() {
                openPopup(user.id); 
            });
                
            });
        }

function requestBook(userId) {
    // Logic for requesting the book from the selected user
    console.log(`Requesting book from user with ID: ${userId}`);
}
function openPopup(userId) {
    const modal = document.getElementById('modal'); 
    if (modal) {
        modal.showModal(); 
    }
    else {
        console.error('The modal element was not found.');
    }

}
