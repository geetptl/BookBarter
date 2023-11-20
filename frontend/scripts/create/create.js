function showPopup() {
  document.getElementById('customPopup').style.display = 'block';
}

function closePopup() {
  document.getElementById('customPopup').style.display = 'none';
}

function createUser() {
  console.log("I am here!");
    const userData = {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "user_id" : document.getElementById("username").value,
        "password_hash" : document.getElementById("password").value
    };
  
    fetch('http://localhost:8000/user/create', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),  
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.error!=undefined && result.error.length>0){
            document.getElementById('customPopup').style.display = 'block';
            document.getElementById('email').value = "";
            document.getElementById('first_name').value = "";
            document.getElementById('last_name').value = "";
            document.getElementById('phonenumber').value = "";
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            throw new Error;
        } 
        console.log('User created:', result);
        window.location.href = '../../templates/login/login.html';
      })  
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }
  