const books = require("../db/books");

async function filterBooks(query) {
    return books.filter((book) => {
        return (
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.genre.toLowerCase().includes(query.toLowerCase())
        );
    });
}

module.exports = {
    filterBooks,
};
