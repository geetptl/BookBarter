window.onload = function () {
    fetch("/search/all")
        .then((response) => response.json())
        .then(displayBooks)
        .catch(console.error);
};

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.querySelector('input[type="text"]').value;
    if (query.trim() === "") {
        fetch("/search/all")
            .then((response) => response.json())
            .then(displayBooks)
            .catch(console.error);
    } else {
        fetch(`/search/query/${query}`)
            .then((response) => response.json())
            .then(displayBooks)
            .catch(console.error);
    }
});

function displayBooks(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    data.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "book";
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}
