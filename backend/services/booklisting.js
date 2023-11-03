const db = require("../db");
async function createNewListing(bookListingData) {
    try {
        const result = await db.query(
            "INSERT INTO book_listing(owner_id, book_id, status, status_code, returns_on) VALUES($1, $2, $3, $4, NOW()) RETURNING *",
            [
                bookListingData.owner_id,
                bookListingData.book_id,
                bookListingData.status,
                bookListingData.status_code,
            ],
        );
        if (result.rowCount === 1) {
            console.log("Request created successfully.");
            return true;
        } else {
            console.log("Failed to create request.");
            return false;
        }
    } catch (error) {
        console.log(error.code);
        if (error.code === '23505') { // 23505 is the error code for unique violation in PostgreSQL
        
            console.error("Duplicate listing entry:", error);
            
            throw new Error('Duplicate listing entry');
        } else {
            console.error("Error creating listing:", error);
            throw error;
        }
    }
}

async function getBookName(listingid) {
    try{
        const result = await db.query(`SELECT b.title FROM book_listing bl 
                                JOIN book b ON bl.book_id = b.id WHERE bl.id = ${listingid}`);
        console.log("Retreieved the record and returned book name");
        return result.rows;
    }
    catch{
        console.log("Book id doesnt exist.")
        return false;
    }

}

async function getBookListing(bookid){
    try{
        const result = await db.query(`SELECT u.first_name, u.email, bl.status FROM 
                            book_listing bl JOIN users u ON bl.owner_id = u.id 
                            JOIN book b ON bl.book_id = b.id WHERE b.id = ${bookid} 
                            AND bl.status = 'Available'; `);
        if(result.rowCount >1){
            console.log("Retrieved available Users for given book id");
            return result.rows;
        }
        else{
            console.log("No available users for the book id");
            return result.rows;
        }
    }
    catch{
        console.log("Book id doesnt exist.")
        return false;
    } 

}

async function getBooksbyUserid(userid){
    try{
        const result = await db.query(`SELECT b.*
                                        FROM book b
                                        INNER JOIN book_listing bl ON b.id = bl.book_id
                                        INNER JOIN users u ON bl.owner_id = u.id
                                        WHERE u.id = ${userid}; `);
        if(result.rowCount >1){
            console.log("Retrieved available books for given user id");
            return result.rows;
        }
        else{
            console.log("No available books for the userid.");
            return result.rows;
        }
    }
    catch{
        console.log("user id doesnt exist.")
        return false;
    } 

}

async function updateStatusAvailable(bookListingData){
    try {
        const bookId = bookListingData.book_id;
        const userId = bookListingData.owner_id;
        console.log(bookId, userId)
        const result = await db.query(
            `UPDATE book_listing SET status = 'Available' WHERE owner_id = ${userId} AND book_id = ${bookId};`
        );
        if (result.rowCount === 1) {
            console.log("Update Successful");
            return true;
        } else {
            console.log("Failed to update");
            return false;
        }
    }
    catch(error){
        console.error("Error updating listing:", error);
        throw error;
    }
}

async function updateStatusNotAvailable(bookListingData){
    try {
        const bookId = bookListingData.book_id;
        const userId = bookListingData.owner_id;
        const result = await db.query(
            `UPDATE book_listing SET status = 'Not Available' WHERE owner_id = ${userId} AND book_id = ${bookId};`
        );
        if (result.rowCount === 1) {
            console.log("Update Successful");
            return true;
        } else {
            console.log("Failed to update");
            return false;
        }
    }
    catch(error){
        console.error("Error updating listing:", error);
        throw error;
    }
}

module.exports = {
    createNewListing,
    getBookName,
    getBookListing,
    getBooksbyUserid,
    updateStatusAvailable,
    updateStatusNotAvailable
};
