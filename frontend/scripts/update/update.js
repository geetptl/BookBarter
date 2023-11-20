
window.onload = function () {
  user_id = getTokenFromSession();
  getUser(user_id);
};

function getTokenFromSession() {  
  var user_id = sessionStorage.getItem('user_id');
  console.log(user_id);
  return user_id;
}

function updateUser() {
    console.log(document.getElementById("phonenumber"));
    console.log(document.getElementById("username"));
    const userData =    {
        "email":document.getElementById("email").value,
        "first_name" : document.getElementById("first_name").value,     
        "last_name" :document.getElementById("last_name").value,
        "phone_number" : document.getElementById("phonenumber").value,
        "user_id" : document.getElementById("username").value,
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
        window.location.href = '../search/search.html';
       
      })  
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }
  
function getUser(user_id) {
  const userData ={
    "user_id":user_id,
  }
    fetch('http://localhost:8000/user/getUpdateDetails', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify(userData),     
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
      });
  }
     
  