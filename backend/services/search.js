const db = require("../db");
const bookService = require("./book");

async function filterBooks(keywords, page, limit) {
    const queryStr = `SELECT b.* FROM book b WHERE LOWER(b.title) LIKE '${keywords}%' LIMIT ${limit} OFFSET ${
        (page - 1) * limit
    }`;
    const bookResults = await db.query(queryStr);
    console.log(bookResults);
    if (bookResults.rows.length == 0) {
        return null;
    }
    let bookRes = await Promise.all(
        bookResults.rows.map(async (res) => {
            let bookRes_ = res;
            bookRes_.genre = await bookService.getGenres(bookRes_.id);
            return bookRes_;
        }),
    );
    return bookRes;
}

module.exports = {
    filterBooks,
};
