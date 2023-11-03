function displayBooks(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    data.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "card";
        bookDiv.style = "width: 15%;";
        bookDiv.innerHTML = `
            <div style="display: flex;">
                <img src="${book.image_url}" class="card-img-top" alt="${book.title}" style="width: 40%; height: auto; margin-right: 10px;">
                <div>
                    <h2 class="card-title" onclick="showBookDetails(${book.id})">${book.title}</h2>
                    <p>Author: ${book.author}</p>
                    <p>ISBN: ${book.isbn}</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}

function showBookDetails(bookId) {
    fetch(`http://localhost:8000/book/details?id=${bookId}`)
        .then((response) => response.json())
        .then((bookDetails) => {
            const detailsDiv = document.getElementById("book-details");
            detailsDiv.innerHTML = `
                <div style="display: flex;">
                    <img src="${bookDetails.image_url}" style="width: 40%; height: auto; margin-right: 10px;">
                    <div>
                        <h2>${bookDetails.title}</h2>
                        <p>Author: ${bookDetails.author}</p>
                        <p>ISBN: ${bookDetails.isbn}</p>
                    </div>
                </div>
                <h3>Users with this book:</h3>
                <ul>
                    ${bookDetails.users.map(user => `<li>${user.name} <button onclick="requestBook('${user.id}')">Request</button></li>`).join('')}
                </ul>
            `;
        })
        .catch(console.error);
}

function requestBook(userId) {
    // Logic for requesting the book from the selected user
    console.log(`Requesting book from user with ID: ${userId}`);
}