
window.onload = function () {
    getUser(currentPage);
};

function updateUser() {
    
    const userData = {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "password_hash" : document.getElementById("password").value
    };

    fetch('http://localhost:8000/user/update', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('User updated:', result);
      })  
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }
  
  
function getUser() {
    const userData = {
        
    };

    fetch('http://localhost:8000/user/getUpdateDetails', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('User details fetched:', result);
      })  
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }
  
  