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
            if (result["User Login"] == "Incorrect") {
                document.getElementById("customPopup").style.display = "block";
                document.getElementById("errorMessages").textContent =
                    "Username/Password combination incorrect!";
            } else if (result["User Login"] == "False") {
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

                window.location.href = "../search/search.html";
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
