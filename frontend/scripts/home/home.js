window.onload = () =>{
    exchanges();
    topLenders();
    topBooks();
}
async function exchanges() {
    try{
        const resp = await fetch(`http://localhost:8000/home/getSuccessfulTransaction`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await resp.json()
        if(data){
            document.querySelector('.carousel-item.active .fs-4').textContent = data[0].total_successful_exchanges
        }
        else {
            throw new Error('Failed to fetch data');
        }
    }
    catch{
        console.error("No Transactions found.");
    }
}

async function topLenders() {
    try {
        const response = await fetch('http://localhost:8000/home/getTopLenders'); 
        const topLenders = await response.json();
        console.log(topLenders)

        if (response.ok && Array.isArray(topLenders)) {
            const lendersContainer = document.querySelector('.carousel-item .d-flex.flex-wrap');
            lendersContainer.innerHTML = ''; // Clear existing content

            topLenders.forEach(lender => {
                const card = document.createElement('div');
                card.className = 'card lender-card mx-2';
                card.innerHTML = `
                    <div class="card-body text-center">
                        <p class="card-text">${lender.first_name} ${lender.last_name}</p> <!-- Assuming 'name' is the property -->
                    </div>
                `;
                lendersContainer.appendChild(card);
            });
        } else {
            throw new Error('Failed to fetch top lenders');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function topBooks() {
    try {
        const response = await fetch('http://localhost:8000/home/getBooksMaxRequest'); 
        const books = await response.json();

        if (response.ok && Array.isArray(books)) {
            const topBooksContainer = document.getElementById('top-books-container');
            topBooksContainer.innerHTML = ''; // Clear existing content

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'card mx-2';
                bookCard.innerHTML = `
                    <div class="card-body text-center">
                        <p class="card-text">${book.title}</p>
                    </div>
                `;
                topBooksContainer.appendChild(bookCard);
            });
        } else {
            throw new Error('Failed to fetch top requested books');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function resetForm() {
    document.getElementById("form1").reset();
}