function showPopup() {
  document.getElementById('customPopup').style.display = 'block';
}

function showError(message) {
  document.getElementById('customPopup').style.display = 'none';
  showPopup1();
  document.getElementById('errorMessages').textContent = message;
}

function closePopup1() {
  document.getElementById('customPopup1').style.display = 'none';
}

function showPopup1() {
  document.getElementById('customPopup1').style.display = 'block';
}

 async function createUser() {
  try{
    const userData = {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "user_id" : document.getElementById("username").value,
        "password_hash" : document.getElementById("password").value
    };
   
    document.getElementById('errorMessages').innerHTML = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(userData.email);
  const phoneRegex = /^\d{10}$/; 
  const isPhoneValid = phoneRegex.test(userData.phone_number);
  // User ID validation for alphanumeric characters, !, ., _ and length between 8-20 characters
  const userIdRegex = /^[a-zA-Z0-9!._]{4,20}$/;
  const isUserIdValid = userIdRegex.test(userData.user_id);
  let message = true;
   
  if(!isUserIdValid){
    console.log("user invalid")
    showError('User ID is not valid! Please enter a valid username, 4-20 characters long with alphanumeric characters and/or any of these symbols [!,.,\'_\']');
    message = false;
    throw new Error;

  }
  
  if(!isPhoneValid && message){
    console.log("phone invalid");
    showError('Phone number is not valid!');
    message = false;
    throw new Error;

  }

  if(!isEmailValid && message){
    console.log("email invalid");
    showError('Email ID is not valid!');
    throw new Error;
  }

     fetch('http://localhost:8000/user/create', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),  
    })
      .then((response) => response.json())
      .then(async (result) => {
        if(result.error!=undefined && result.error.length>0){
            document.getElementById('customPopup').style.display = 'block';
            document.getElementById('email').value = "";
            document.getElementById('first_name').value = "";
            document.getElementById('last_name').value = "";
            document.getElementById('phonenumber').value = "";
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            throw result.error;
        } 
        console.log('User created:', result);  
        showError('User created successfully! :)');
        setTimeout(function() {
        window.location.href = '../../templates/login/login.html';
        }, 500);
      })  
      .catch((error) => {
        document.getElementById('customPopup').style.display = 'block';
        document.getElementById('errorMessage').innerText = error || 'An error occurred.';
        console.error('Error creating user:', error);
      });

  }
  catch(error){
    console.error('An error occurred:', error.message);
   }}
  