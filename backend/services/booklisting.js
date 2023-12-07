const db = require("../db");
async function createNewListing(bookListingData) {
    try {
        const result = await db.query(
            "INSERT INTO book_listing(owner_id, book_id, status, returns_on) VALUES($1, $2, $3, DATE('now')) RETURNING *",
            [
                bookListingData.owner_id,
                bookListingData.book_id,
                bookListingData.status,
            ],
        );
        if (result) {
            console.log("Request created successfully.");
            return true;
        } else {
            console.log("Failed to create request.");
            return false;
        }
    } catch (error) {
        console.log(error.code);
        if (error.code === "23505") {
            // 23505 is the error code for unique violation in PostgreSQL
            console.error("Duplicate listing entry:", error);
            throw new Error("Duplicate listing entry");
        } else {
            console.error("Error creating listing:", error);
            throw error;
        }
    }
}

async function getBookName(listingid) {
    try {
        const result = await db.query(`SELECT b.title FROM book_listing bl 
                                JOIN book b ON bl.book_id = b.id WHERE bl.id = ${listingid}`);
        console.log("Retreieved the record and returned book name");
        return result;
    } catch {
        console.log("Book id doesnt exist.");
        return false;
    }
}

async function getBookListing(bookid) {
    try {
        const result =
            await db.query(`SELECT u.first_name, u.email, bl.status FROM 
                            book_listing bl JOIN users u ON bl.owner_id = u.id 
                            JOIN book b ON bl.book_id = b.id WHERE b.id = ${bookid} 
                            AND bl.status = 'Available'; `);
        if (result) {
            console.log("Retrieved available Users for given book id");
            return result;
        } else {
            console.log("No available users for the book id");
            return result;
        }
    } catch {
        console.log("Book id doesnt exist.");
        return false;
    }
}

async function getBooksbyUserid(userid) {
    try {
        console.log(userid)
        const result = await db.query(`SELECT b.*, bl.*
                                        FROM book b
                                        INNER JOIN book_listing bl ON b.id = bl.book_id
                                        INNER JOIN users u ON bl.owner_id = u.id
                                        WHERE u.id = ${userid}; `);
        if (result) {
            console.log("Retrieved available books for given user id");
            return result;
        } else {
            console.log("No available books for the userid.");
            return result;
        }
    } catch {
        console.log("user id doesnt exist.");
        return false;
    }
}


async function updateStatus(bookListingData) {
    try {
        const bookId = bookListingData.book_id;
        const userId = bookListingData.owner_id;
        const status =  bookListingData.status;
        const result = await db.query(
            "UPDATE book_listing SET status = ? WHERE owner_id = ? AND book_id = ? RETURNING *;",
            [
                status,
                userId,
                bookId,
            ]
        );
        if (result) {
            console.log("Update Successful");
            console.log(result)
            return true;
        } else {     
            console.log("Failed to update");
            return false;
        }
    } catch (error) {
        console.error("Error updating listing:", error);
        throw error;
    }
}

module.exports = {
    createNewListing,
    getBookName,
    getBookListing,
    getBooksbyUserid,
    updateStatus,
};
