let token = null;

window.onload = function () {
    token = sessionStorage.getItem("token");
    getUser();
}

function getTokenFromSession() {
    return sessionStorage.getItem("user_id");
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

function showError(message) {
    document.getElementById("customPopup").style.display = "block";
    document.getElementById("errorMessage").textContent = message;
}

function initializeAutocomplete() {
    const addressInput = document.getElementById("address");
    if (addressInput) {
        new google.maps.places.Autocomplete(addressInput);
    }
}

async function getUser() {
    try {
        const data = await fetch("http://localhost:8000/user/getUpdateDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'authorization': `${token}`
            },
            body: JSON.stringify(),
        })
    
        await data.json()
            .then((result) => {
                if (result.error) {
                    throw new Error(result.error);
                }
                console.log("User details fetched:", result[0]);
                document.getElementById("email").value = result[0].email;
                document.getElementById("first_name").value = result[0].first_name;
                document.getElementById("last_name").value = result[0].last_name;
                document.getElementById("phonenumber").value = result[0].phone_number;
                document.getElementById("address").value = result[0].address;
                document.getElementById("username").value = result[0].user_id;
                initializeAutocomplete();
            })
    } catch(error) {
        console.error("Error fetching user details:", error);
        document.getElementById('customPopup').style.display = 'block';
        document.getElementById('errorMessage').innerText = error || 'An error occurred.';
    }
}

function updateUser() {
    const userData =    {
        "email": document.getElementById("email").value,
        "first_name": document.getElementById("first_name").value,     
        "last_name": document.getElementById("last_name").value,
        "phone_number": document.getElementById("phonenumber").value,
        "address": document.getElementById("address").value,
        "user_id": document.getElementById("username").value,
    };
    document.getElementById('errorMessage').innerHTML = '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; 
    const userIdRegex = /^[a-zA-Z0-9!._]{4,20}$/;
    
    if (!userIdRegex.test(userData.user_id)) {
        showError("Invalid username. Username should be 4-20 characters long.");
        return;
    }
    if (!phoneRegex.test(userData.phone_number)) {
        showError("Invalid phone number.");
        return;
    }
    if (!emailRegex.test(userData.email)) {
        showError("Invalid email address.");
        return;
    }

    fetch('http://localhost:8000/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `${token}`
        },
        body: JSON.stringify(userData),  
      })
        .then((response) => response.json())
        .then((result) => {
          console.log('User updated:', result);
          window.location.href = '../search/search.html';
         
        })  
        .catch((error) => {
          console.error('Error updating user:', error);
          document.getElementById('customPopup').style.display = 'block';
          document.getElementById('errorMessage').innerText = error || 'An error occurred.';
        });
}

google.maps.event.addDomListener(window, "load", initializeAutocomplete);
