// import { BASE_PATH } from "../../config.js";

let currentPage = 1;
let lastPage = 7371;
let limit = 18;

window.onload = function () {
    fetchBooks(currentPage);
    updatePagination();
};

document.addEventListener('DOMContentLoaded', function () {
    var tokenValue = sessionStorage.getItem('token');
    const logoutButton = document.getElementById('logoutButton');
    const profileButton = document.getElementById('profileButton');
    if (tokenValue) {
        logoutButton.style.display = 'block';
        profileButton.style.display = 'block';
    } else {
        console.log('Token not found');
        logoutButton.style.display = 'none';
        profileButton.style.display = 'none';
    }    
});

document.querySelector("#previous-page").addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage);
        updatePagination();
    }
    this.blur();
});

document.querySelector("#next-page").addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < lastPage) {
        currentPage++;
        fetchBooks(currentPage);
        updatePagination();
    }
    this.blur();
});

document.querySelector(".btn").addEventListener("click", function (event) {
    event.preventDefault();
    const query = document.querySelector('input[type="text"]').value;
    if (query.trim() === "") {
        fetchBooks(currentPage);
        updatePagination();
    } else {
        fetchFilteredBooks(query, currentPage);
        updatePagination();
    }
    this.blur();
});

document.querySelector('input[name="query"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector('.btn').click();
    }
});

function fetchBooks(page) {
    fetch(`http://localhost:8000/search/all?page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then(displayBooks)
        .catch(console.error);
}

function fetchFilteredBooks(keyword, page) {
    fetch(`http://localhost:8000/search/query?keywords=${keyword}&page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then(displayBooks)
        .catch(console.error)
}

function showBookDetails(bookId) {

    window.location.href = `../../se-backend/frontend/templates/listings/booklisting.html?id=${bookId}`;
    /*fetch(`http://localhost:8000/book/get/${bookId}`)
        .then((response) => response.json())
        .then(bookDetails => {
            const bookId = bookDetails.book.id;
            //document.cookie = `bookId=${bookId};path=/;max-age=3600`; 
            window.location.href = `../../se-backend/frontend/templates/listings/booklisting.html?id=${bookId}`;
        })
        .catch(console.error);*/      
}


function logout() {
    sessionStorage.removeItem('token');
    window.location.href = '../login/login.html';
}

function trimLongText(text, len_) {
    return (text.length > len_ ? (text.substring(0, len_ - 3) + "...") : text);
}

function displayBooks(data) {
    const resultsDiv = document.getElementById("results");
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

function updatePagination() {
    const pagination = document.getElementsByClassName("pagination");
    const existingPageButtons = pagination[0].getElementsByClassName("page-button");
    
    while (existingPageButtons.length > 0) {
        existingPageButtons[0].parentNode.removeChild(existingPageButtons[0]);
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
        const li = document.createElement("li");
        li.className = "page-item page-button" + (i === currentPage ? " active" : "");
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click", function (event) {
            event.preventDefault();
            currentPage = i;
            fetchBooks(currentPage);
            updatePagination();
        });
        pagination[0].insertBefore(li, document.getElementById("next-page").parentNode);
    }

    document.getElementById("previous-page").parentNode.classList.toggle("disabled", currentPage === 1);
    document.getElementById("next-page").parentNode.classList.toggle("disabled", currentPage === lastPage);
}
