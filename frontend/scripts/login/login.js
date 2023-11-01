function validateLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    if (username === 'admin' && password === '1234') {
        window.location.href = '../../templates/search/search.html';
    } else {
        alert('Invalid username or password.');
    }
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
  