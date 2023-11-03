function displayBooks() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    userBooks.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "card";
        bookDiv.style = "width: 15%;";
        bookDiv.innerHTML = `
            <div style="display: flex;">
                <img src="${book.image_url}" class="card-img-top" alt="${book.title}" style="width: 100px; height: auto; margin-right: 10px;">
                <div>
                    <h2 class="card-title">${book.title}</h2>
                    <p>Author: ${book.author}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <button onclick="toggleAvailability(${book.id})">${book.available ? 'Make Unavailable' : 'Make Available'}</button>
                </div>
            </div>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}

function toggleAvailability(bookId) {
    const book = userBooks.find(book => book.id === bookId && book.userId === loggedInUser.id);
    if (book) {
        book.available = !book.available;
        displayBooks();
    }
}

// Call the displayBooks function to display the logged-in user's available books
displayBooks();