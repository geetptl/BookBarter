
document.addEventListener("DOMContentLoaded", function () {
    fetchUserDataAdmin();
    fetchRequestDataAdmin();
});

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

function renderUserData(data) {
    const adminDetailsDiv = document.getElementById('admin-details');
    adminDetailsDiv.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const keys = [
        'id',
        'created_on',
        'last_updated_on',
        'user_id',
        'email',
        'phone_number',
        'first_name',
        'last_name',
        'latitude',
        'longitude',
        'is_auth',
        'is_admin'
      ];
    
      keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.replace(/_/g, ' '); 
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
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
