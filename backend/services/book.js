const db = require("../db");

async function getGenres(bookId) {
    const genreResult = await db.query(
        "SELECT g.name genre FROM book_genre_mapping bgm JOIN genre g ON bgm.genre_id=g.id WHERE bgm.book_id=$1 GROUP BY 1",
        [bookId],
    );
    let genres = new Set();
    genreResult.rows.forEach((elem) => {
        genres.add(elem.genre);
    });
    return Array.from(genres);
}

async function getById(bookId) {
    
    const bookResult = await db.query("SELECT * FROM book WHERE id=$1", [
        bookId,
    ]);
    if (bookResult.rows.length == 0) {
        return null;
    }

    const usersWithBook = await db.query(
        "SELECT u.* FROM users u JOIN book_listing bl ON bl.owner_id=u.id WHERE bl.book_id=$1 AND bl.status='Available'",
        [bookId],
    );

    let bookRes = bookResult.rows[0];
    bookRes.genres = await getGenres(bookId);

    return {
        book: bookRes,
        users: usersWithBook.rows,
    };
}

module.exports = {
    getById,
    getGenres,
};
