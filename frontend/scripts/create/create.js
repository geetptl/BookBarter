function showPopup() {
    document.getElementById("customPopup").style.display = "block";
}

function showPopup1() {
    document.getElementById("customPopup1").style.display = "block";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

function closePopup1() {
    document.getElementById("customPopup1").style.display = "none";
}

function showError(message) {
    document.getElementById("customPopup").style.display = "none";
    showPopup1();
    document.getElementById("errorMessages").textContent = message;
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var toggleButton = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.classList.add("active");
    } else {
        passwordInput.type = "password";
        toggleButton.classList.remove("active");
    }
}

function initializeAutocomplete() {
    const addressInput = document.getElementById("address");
    if (addressInput) {
        new google.maps.places.Autocomplete(addressInput);
    }
}

async function createUser() {
    try {
        const userData = {
            email: document.getElementById("email").value,
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            phone_number: document.getElementById("phonenumber").value,
            address: document.getElementById("address").value,
            user_id: document.getElementById("username").value,
            password_hash: document.getElementById("password").value,
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const userIdRegex = /^[a-zA-Z0-9!._]{4,20}$/;

        if (!userIdRegex.test(userData.user_id)) {
            throw new Error("Invalid username. Username should be 4-20 characters long.");
        }
        if (!phoneRegex.test(userData.phone_number)) {
            throw new Error("Invalid phone number.");
        }
        if (!emailRegex.test(userData.email)) {
            throw new Error("Invalid email address.");
        }

        fetch("http://localhost:8000/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then(async (result) => {
                if (result.error != undefined && result.error.length > 0) {
                    document.getElementById("customPopup").style.display =
                        "block";
                    document.getElementById("email").value = "";
                    document.getElementById("first_name").value = "";
                    document.getElementById("last_name").value = "";
                    document.getElementById("phonenumber").value = "";
                    document.getElementById("address").value = "";
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
                    throw result.error;
                }
                console.log("User created:", result);
                showError("User created successfully! :)");
                setTimeout(function () {
                    window.location.href = "../../templates/login/login.html";
                }, 500);
            })
            .catch((error) => {
                document.getElementById("customPopup").style.display = "block";
                document.getElementById("errorMessages").innerText =
                    error || "An error occurred.";
                console.error("Error creating user:", error);
            });
    } catch (error) {
        console.error("An error occurred:", error.message);
        document.getElementById("customPopup").style.display = "block";
        document.getElementById("email").value = "";
        document.getElementById("first_name").value = "";
        document.getElementById("last_name").value = "";
        document.getElementById("phonenumber").value = "";
        document.getElementById("address").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        showError(error.message);
    }
}

google.maps.event.addDomListener(window, "load", initializeAutocomplete);
