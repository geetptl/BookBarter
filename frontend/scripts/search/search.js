// import { BASE_PATH } from "../../config.js";

window.onload = function () {
    fetch(`http://localhost:8000/search/all`)
        .then((response) => response.json())
        .then(displayBooks)
        .catch(console.error);
};

document.querySelector(".btn").addEventListener("click", function (event) {
    event.preventDefault();
    const query = document.querySelector('input[type="text"]').value;
    if (query.trim() === "") {
        fetch(`http://localhost:8000/search/all`)
            .then((response) => response.json())
            .then(displayBooks)
            .catch(console.error);
    } else {
        fetch(`http://localhost:8000/search/query/${query}`)
            .then((response) => response.json())
            .then(displayBooks)
            .catch(console.error);
    }
    this.blur();
});

document.querySelector('input[name="query"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector('.btn').click();
    }
});

function displayBooks(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    data.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "card";
        bookDiv.style = "width: 15%;";
        bookDiv.innerHTML = `
            <img src="${book.cover}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
                <h2 class="card-title">${book.title}</h2>
                <p class="card-text">Author: ${book.author}</p>
                <p class="card-text">Genre: ${book.genre}</p>
            </div>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}