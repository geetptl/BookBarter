// Displays the popup
function showPopup(bookTitle) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    popupTitle.textContent = bookTitle;
    popup.style.display = 'block';
}

// Closes popup if the overlay is clicked
document.getElementById('popup').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

// Attachs showPopup function to each book card
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const bookTitle = this.querySelector('.card-title').textContent;
        showPopup(bookTitle);
    });
});
