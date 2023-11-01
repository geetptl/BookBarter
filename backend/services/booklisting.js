const db = require("../db");
async function createNewListing(bookListingData) {
    try{
        const result = await db.query(
            'INSERT INTO book_listing(owner_id, book_id, status, status_code, returns_on) VALUES($1, $2, $3, $4, NOW()) RETURNING *',
            [bookListingData.owner_id, bookListingData.book_id, bookListingData.status, bookListingData.status_code]
        );
        if (result.rowCount === 1) {
            console.log("Request created successfully.");
            return true;
        } else {
            console.log("Failed to create request.");
            return false;
        }
    }
    catch(error){
        console.error("Error creating request:", error);
        return false;
    }
}


module.exports = {
    createNewListing
};