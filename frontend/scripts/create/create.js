
function createUser() {
    const userData = {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "user_id" : document.getElementById("username").value,
        "password" : document.getElementById("password").value
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
        console.log('User created:', result);
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }
  