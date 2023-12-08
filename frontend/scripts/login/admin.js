
document.addEventListener("DOMContentLoaded", function () {
    fetchUserDataAdmin();
    fetchRequestDataAdmin();
});

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
    const adminDetailsDiv = document.getElementById('admin-request-details');
    adminDetailsDiv.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const keys = [
        'id',
        'created',
        'last_modified',
        'borrower_id',
        'lender_id',
        'book_listing_Id',
        'time_to_live',
        'borrow_duration',
        'status'
      ];
    
      keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.replace(/_/g, ' '); 
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    if(data){
    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    adminDetailsDiv.appendChild(table);
}
}

function renderUserData(data) {
    const adminDetailsBody = document.getElementById('admin-details-body');
    adminDetailsBody.innerHTML = ''; // Clear existing data

    data.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
            
        });

        if (item.is_admin !== 1) {
        const deleteTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.addEventListener('click', () => deleteUser(item.id)); 
        deleteTd.appendChild(deleteBtn);
        row.appendChild(deleteTd);
        }
        else{
            const blankTd = document.createElement('td');
            row.appendChild(blankTd);
        }
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





