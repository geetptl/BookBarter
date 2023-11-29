let token = null;
window.onload = function () {
  token = sessionStorage.getItem('token');
  getUser();
};

function showError(message) {
  document.getElementById('customPopup').style.display = 'block';
  document.getElementById('errorMessages').textContent = message;
}

function getTokenFromSession() {  
  var user_id = sessionStorage.getItem('user_id');
  return user_id;
}

function updateUser() {
  try{
    console.log(document.getElementById("phonenumber"));
    console.log(document.getElementById("username"));
    const userData =    {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,     
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "user_id" : document.getElementById("username").value,
    };
    document.getElementById('errorMessages').innerHTML = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(userData.email);
  const phoneRegex = /^\d{10}$/; 
  const isPhoneValid = phoneRegex.test(userData.phone_number);
  // User ID validation for alphanumeric characters, !, ., _ and length between 4-20 characters
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

    fetch('http://localhost:8000/user/update', {
      method: 'POST',
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
  catch(error){
    console.error('An error occurred:', error.message);
   }}
  
function getUser() {
    fetch('http://localhost:8000/user/getUpdateDetails', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'authorization': `${token}`
      }, 
      body: JSON.stringify(),
    })
      .then((response) => response.json())  
      .then((result) => {
        console.log('User details fetched:', result);   
        document.getElementById("email").value= result[0].email;
        document.getElementById("first_name").value= result[0].first_name;
        document.getElementById("last_name").value=   result[0].last_name;
        document.getElementById("phonenumber").value= result[0].phone_number;
        document.getElementById("username").value= result[0].user_id;   
       // document.getElementById("password").value=   result[0].user_id;
      })  
      .catch((error) => {
        console.error('Error fetching user details:', error);
        document.getElementById('customPopup').style.display = 'block';
        document.getElementById('errorMessage').innerText = error || 'An error occurred.';
      });
  }
     
  