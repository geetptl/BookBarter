
document.addEventListener("DOMContentLoaded", function () {
    fetchUserDataAdmin();
    fetchRequestDataAdmin();
});

// ... (Your existing code)

function fetchRequestDataAdmin() {
    var token = sessionStorage.getItem('token');
    console.log(token);
    fetch('http://localhost:8000/user/getRequestDetailsforAdmin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Received JSON data:', data);
        renderRequestData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function renderRequestData(data) {
    const adminRequestDetailsBody = document.getElementById('admin-request-details-body');
    adminRequestDetailsBody.innerHTML = ''; // Clear existing data

    data.forEach(item => {
        const row = document.createElement('tr');
        const columnsToRender = [
            'id',
            'created',
            'last_modified',
            'borrower_id',
            'lender_id',
            'book_listing_id',
            'time_to_live',
            'borrow_duration',
            'status'
        ];

        columnsToRender.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column];
            row.appendChild(td);
        });

        adminRequestDetailsBody.appendChild(row);
    });
}


function renderUserData(data) {
    const adminDetailsBody = document.getElementById('admin-details-body');
    adminDetailsBody.innerHTML = ''; // Clear existing data

    data.forEach(item => {
        if (item.is_admin === 1) {
            return;
        }
        const row = document.createElement('tr');
        const columnsToRender = ['id', 'created_on', 'last_updated_on', 'user_id', 'email', 'phone_number', 'first_name', 'last_name', 'latitude', 'longitude'];
        columnsToRender.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column];
            row.appendChild(td);
            
        });

        const deleteTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.addEventListener('click', () => deleteUser(item.id)); 
        deleteTd.appendChild(deleteBtn);
        row.appendChild(deleteTd);

        adminDetailsBody.appendChild(row);
    });
}

function fetchUserDataAdmin() {
    var token = sessionStorage.getItem('token');
    console.log(token);
    fetch('http://localhost:8000/user/getUserDetailsforAdmin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`
        },
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Received JSON data:', data);
        renderUserData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


function deleteUser(userId) {
    var token = sessionStorage.getItem('token');
    fetch('http://localhost:8000/user/deleteUserByAdmin', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({ userId: userId }),
    })
    .then((response) => {
        if (response.status === 204) {
            alert('User deleted successfully');
            window.location.reload();
        } else {
            alert('An error occurred while deleting the profile.');
        }
    })
    .catch((error) => {
        console.error('An unexpected error occurred:', error);
    });
}





