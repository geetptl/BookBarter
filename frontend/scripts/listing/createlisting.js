

let token = null;
let globalUserId = null;
let listingStatus = {}
window.onload = function () {
    token = sessionStorage.getItem("token");
    user = sessionStorage.getItem("user_id");
    //const valUser = sessionStorage.getItem("id");
    let uid;
    console.log(user);
    console.log(token);
    if(user){
         fetch(`http://localhost:8000/user/getUserDetails/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `${token}`,

            },
        })
        .then((response) => response.json())
        .then(data => {
            handleGlobalUser(data);
            displayUserDetails(data);
            populateBookDropdown();
        })

    }
   
    
}
function handleGlobalUser(user){
    globalUserId = user.id;
}

function displayUserDetails(user) {
    const userdetails = document.getElementById("user-details");
    userdetails.innerHTML = "";
    // Generate a unique seed from the user's name
    const seed = encodeURIComponent(user.first_name + user.last_name);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + user.last_name)}&background=random`;


    const userInfo = document.createElement("div");
    userInfo.classList.add("card", "my-3");
    userInfo.style.maxWidth = '540px';
    userInfo.innerHTML = `
    <div class="row g1 d-flex" >

        <div class="row g-0">
            <div class="col-md-4 d-flex align-items-center justify-content-center p-3">
                <img src="${avatarUrl}" class="img-fluid rounded-start" alt="User Avatar">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h3 class="card-title">${user.first_name} ${user.last_name}</h3>
                    <p class="card-text"><strong>Address: </strong>${user.address}</p>
                    <p class="card-text"><strong>Phone Number: </strong>${user.phone_number}</p>
                    <p class="card-text"><strong>Email: </strong>${user.email}</p>
                </div>
            </div>
        </div>
   </div>
    `;
    userdetails.appendChild(userInfo);

    fetch(`http://localhost:8000/booklisting/getBookbyUserid/${user.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,

        },
    })
    .then((response) => response.json())
    .then(data => {
        displayUserBookDetails(data, user.id);
    })
}

async function populateBookDropdown() {
    const bookSelect = document.getElementById("bookSelect");
    
    const response = await fetch("http://localhost:8000/search/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const books = await response.json();

    books.forEach((book) => {
        const option = document.createElement("option");
        option.value = book.id; 
        option.textContent = book.title; 
        bookSelect.appendChild(option);
    });
}

function displayUserBookDetails(books, userId){
    const listingdetails = document.getElementById("listing-details");

    books.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.className = "card mb-3"; // Use Bootstrap card class
        const selectId = `bookStatus-${index}`;
        console.log(book)
        bookCard.innerHTML = `  
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">Book Name: ${book.title}</h4>
                
                    <select id="${selectId}" name="bookStatus" class="bookStatus">
                        <option value="Available" ${
                            book.status === "Available" ? "selected" : ""
                        }>Available</option>
                        <option value="Not_Available" ${
                            book.status === "Not_Available" ? "selected" : ""
                        }>Not Available</option>
                    </select>
                </div>
            </div>
            </div>
        `;
        bookCard.addEventListener("change", (event) => {
            handleStatusChange(book.id, event.target.value, userId);
        });
        listingdetails.appendChild(bookCard);
    });
}

async function createNewListing() {
    const bookSelect = document.getElementById("bookSelect");
    const selectedBookId = bookSelect.value; // Get the selected book ID from the dropdown
    
    // Check if a book is selected
    if (!selectedBookId) {
        console.error("Please select a book.");
        return;
    }

    fetch("http://localhost:8000/booklisting/createListing", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
        },
        body: JSON.stringify({
            owner_id: globalUserId, 
            book_id: selectedBookId, 
            status: "Not_Available",
        }),
    })
    .then((response) => response.json())
    .then(async (result) => {
        if (result.error != undefined && result.error.length > 0) {
            document.getElementById("customPopup").style.display = "block";
            throw result.error;
        }
        console.log("Listing created:", result);
        alert("Your listing has been successfully created.");
        window.location.reload(); // Refresh the page
    })
    .catch((error) => {
        document.getElementById("customPopup").style.display = "block";
        document.getElementById("errorMessages").innerText =
            error || "An error occurred.";
        console.error("Error creating listing:", error);
    });
}

function handleStatusChange(bookId, newStatus, userId) {
    // Update the global state or perform other actions here
    //console.log(`Status for book ${bookId} changed to ${newStatus}`);
    listingStatus[bookId] = newStatus;
    console.log(listingStatus)
        fetch(`http://localhost:8000/booklisting/updateBookStatus`, {
                method: "PUT",
                // body: JSON.stringify({ userId: userId }),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `${token}`,
                },
                body: JSON.stringify({
                    book_id: bookId,
                    owner_id: userId,
                    status: newStatus
                }),
            })
}
   
    

    