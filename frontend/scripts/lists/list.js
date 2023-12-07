window.onload = function () {
    const currentLocation = window.location.href;
    if (currentLocation.search("bestbooks") > 0)
        fetchBestBooks('blood', 1, 10);
    else
        fetchCelebrityBooks('death', 'sweet', 'boy', 1, 6);

};

document.addEventListener("DOMContentLoaded", function () {
    var tokenValue = sessionStorage.getItem("token");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    if (tokenValue) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        console.log("Token not found");
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
    }
});

function trimLongText(text, len_) {
    return text.length > len_ ? text.substring(0, len_ - 3) + "..." : text;
}

function fetchBestBooks(keyword, page, limit) {
    fetch(`http://localhost:8000/search/query?keywords=${keyword}&page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => displayBooks(data, document.getElementById("results")))
        .catch(console.error);
}

function fetchCelebrityBooks(keyword1, keyword2, keyword3, page, limit) {
    fetch(`http://localhost:8000/search/query?keywords=${keyword1}&page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => displayBooks(data, document.getElementById("results1")))
        .catch(console.error);

    fetch(`http://localhost:8000/search/query?keywords=${keyword2}&page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => displayBooks(data, document.getElementById("results2")))
        .catch(console.error);

    fetch(`http://localhost:8000/search/query?keywords=${keyword3}&page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => displayBooks(data, document.getElementById("results3")))
        .catch(console.error);
}

function displayBooks(data, resultsDiv) {
    resultsDiv.innerHTML = "";
    data.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "card";
        bookDiv.style = "width: 15%;";
        bookDiv.innerHTML = `
            <img src="${book.image_url}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
                <h2 class="card-title">${trimLongText(book.title, 50)}</h2>
                <p class="card-text">Author: ${trimLongText(book.author, 50)}</p>
                <p class="card-text">Genre: ${trimLongText(book.genre.join(", ") || "NA", 70)}</p>
            </div>
        `;
        bookDiv.addEventListener("click", function () {
            showBookDetails(book.id);
        });
        resultsDiv.appendChild(bookDiv);
    });
}