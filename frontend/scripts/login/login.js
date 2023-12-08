function showPopup() {
    document.getElementById("customPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

function validateLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    const userData = {
        user_id: username,
        password_hash: password,
    };
    console.log(userData);
    fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((result) => { 
            console.log("User logged in:", result);
            if (result["User Login"] == "False") {
                document.getElementById("customPopup").style.display = "block";
                document.getElementById("errorMessages").textContent =
                    "User doesn't exist!"; 
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            } else {
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem(
                    "user_id",
                    document.getElementById("username").value
                );

                fetch("http://localhost:8000/user/getAdmin", {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    'authorization': `${result.token}`,
                    },
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); 
                    })
                    .then((result) => {
                        if (result.message=="User is admin") {
                            window.location.href = "../admin/admin.html";
                        } else {
                            window.location.href = "../search/search.html";
                        }
                    })
                    .catch((error) => {
                        console.error("Error in fetching admin details:", error);
                    });
            }
        })
        .catch((error) => {
            console.error("Error loggin in:", error);
        });
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
