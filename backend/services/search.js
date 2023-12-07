const db = require("../db");
const bookService = require("./book");

async function filterBooks(keywords, page, limit) {
    const keywordPattern = keywords ? `%${keywords.toLowerCase()}%` : "%";
    const queryStr = `
        SELECT id, title, author, image_url
        FROM book
        WHERE LOWER(title) LIKE ? OR LOWER(author) LIKE ?
        ORDER BY id
        LIMIT ?
        OFFSET ?
    `;
    const offset = (page - 1) * limit;
    const bookResults = await db.query(queryStr, [
        keywordPattern,
        keywordPattern,
        limit,
        offset,
    ]);

    if (!bookResults) {
        return null;
    }
    let bookRes = await Promise.all(
        bookResults.map(async (res) => {
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
