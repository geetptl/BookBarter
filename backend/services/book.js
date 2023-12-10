const db = require("../db");

async function getGenres(bookId) {
    const genreResult = await db.query(
        "SELECT g.name genre FROM book_genre_mapping bgm JOIN genre g ON bgm.genre_id=g.id WHERE bgm.book_id=$1 GROUP BY 1",
        [bookId],
    );
    let genres = new Set();
    genreResult.forEach((elem) => {
        genres.add(elem.genre);
    });
    return Array.from(genres);
}

async function getById(bookId, visitor, user_id) {
    const bookResult = await db.query("SELECT * FROM book WHERE id=$1", [
        bookId,
    ]);
    if (!bookResult) {
        return null;
    }

    let bookRes = bookResult[0];
    bookRes.genres = await getGenres(bookId);

    let usersWithBook;
    if (!visitor) {
        usersWithBook = await db.query(
            "SELECT u.*, bl.id as listingId FROM users u JOIN book_listing bl ON bl.owner_id=u.id WHERE bl.book_id=$1 AND bl.status='Available' AND bl.owner_id<>$2",
            [bookId, user_id],
        );
    } else {
        usersWithBook = await db.query(
            "SELECT u.*, bl.id as listingId FROM users u JOIN book_listing bl ON bl.owner_id=u.id WHERE bl.book_id=$1 AND bl.status='Available'",
            [bookId],
        );
    }

    return {
        book: bookRes,
        users: visitor ? null : usersWithBook,
        visitor: visitor,
        userCount: usersWithBook.length,
    };
}

module.exports = {
    getById,
    getGenres,
};
