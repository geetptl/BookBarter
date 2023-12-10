let token = null;
window.onload = () =>{
    token = sessionStorage.getItem("token");
    console.log(token);
    renderRequests();
}

async function renderRequests(){
    try{
        const resp = await fetch(`http://localhost:8000/booklisting/getRequestDetailsforUser`,  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `${token}`,
            },
        });
        const response = await resp.json();
        console.log(response);
        renderRequestData(response);
        
    }
    catch{
        console.error("No exchanges found.");
    }
}

function renderRequestData(data){
    const adminRequestDetailsBody = document.getElementById('admin-request-details-body');
    adminRequestDetailsBody.innerHTML = ''; 
    data.forEach(item => {
        const row = document.createElement('tr');
        const columnsToRender = [
            'seq_num',
            'title',
            'borrower_name',
            'lender_name',
            'status'
        ];

        columnsToRender.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column];
            row.appendChild(td);

            if (column === 'status') {
                td.textContent = item[column] === 'ShipmentReceived' ? 'Exchange Completed' : item[column];
            } else {
                td.textContent = item[column];
            }
            row.appendChild(td)
        });

        adminRequestDetailsBody.appendChild(row);
    });
}