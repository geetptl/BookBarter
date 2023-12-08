const db = require("../db");
async function getSuccessfulTransaction(req) {
    try {
        const result = await db.query(`SELECT COUNT(*) AS total_successful_exchanges
                                        FROM exchange_history
                                        WHERE request_status = 'ShipmentReceived'`);
        console.log("Retrieved all successful transaction");
        return result;
    } catch {
        console.log("Invalid query");
        return false;
    }
}

async function getTopLenders(){
    try {
        const result = await db.query(`SELECT u.first_name, u.id,
                                        COUNT(eh.request_id) AS count FROM exchange_history eh INNER JOIN
                                        users u ON eh.lender_id = u.id WHERE request_status = 'ShipmentReceived'
                                        GROUP BY u.user_id, u.first_name ORDER BY count DESC;`);
        console.log("Retrieved all successful transaction of lenders");
        return result;
    } catch{
        console.log("Invalid query");
        return false;
    }
}

async function getBooksMaxRequest(){
    try {
        const result = await db.query(`SELECT b.title, COUNT(r.id) AS total_requests FROM request r
                                        INNER JOIN book_listing bl ON r.book_listing_id = bl.id
                                        INNER JOIN book b ON bl.book_id = b.id 
                                        GROUP BY b.title ORDER BY total_requests DESC LIMIT 5 ;`)
        console.log("Retrieved all books with max requests");
        return result;
    } catch{
        console.log("Invalid query");
        return false;
    }
}

module.exports = {
    getSuccessfulTransaction,
    getTopLenders,
    getBooksMaxRequest
}
