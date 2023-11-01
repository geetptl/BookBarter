const db = require("../db");
async function createNewListing(bookListingData) {
    const result = await db.query(
        'INSERT INTO book_listing(owner_id, book_id, status, status_code, returns_on) VALUES($1, $2, $3, $4, NOW()) RETURNING *',
        [bookListingData.owner_id, bookListingData.book_id, bookListingData.status, bookListingData.status_code]
    );
    return result.rows[0];
}


module.exports = {
    createNewListing
};