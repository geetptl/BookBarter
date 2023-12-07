const db = require("../db");

async function raiseBorrowRequest(
    borrowerId,
    lenderId,
    listingId,
    borrowDuration,
) {
    try {
        // Use placeholders to prevent SQL injection
        const query = `
            INSERT INTO request (borrower_id, lender_id, book_listing_id, time_to_live, borrow_duration, status)
            VALUES (?, ?, ?, datetime('now', '+2 days'), ?, 'Pending')
        `;

        const values = [borrowerId, lenderId, listingId, borrowDuration];
        // Execute the query
        const result = await db.query(query, values);
        // console.log(query);
        if (result.length === 1) {
            console.log("Request created successfully.");
            return true;
        } else {
            console.log("Failed to create request.");
            return false;
        }
    } catch (error) {
        console.error("Error creating request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function getPendingActionsByLenderId(lenderId) {
    try {
        const query = `
            SELECT *
            FROM request
            WHERE lender_id = ?
            AND status <> 'Expired'
            AND datetime(time_to_live) >= datetime('now', '-2 days');
        `;

        const values = [lenderId];

        const result = await db.query(query, values);

        if (result.length > 0) {
            return result;
        } else {
            return null; // No requests found for the lender
        }
    } catch (error) {
        console.error("Error retrieving requests:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function getPendingActionsByBorrowerId(borrowerId) {
    try {
        const query = `
            SELECT *
            FROM request
            WHERE borrower_id =?
            AND status <> 'Expired'
            AND datetime(time_to_live) >= datetime('now', '-2 days');
        `;

        const values = [borrowerId];

        const result = await db.query(query, values);

        if (result.length > 0) {
            return result;
        } else {
            return null; // No requests found for the borrower
        }
    } catch (error) {
        console.error("Error retrieving requests:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function invalidateOldRequests() {
    try {
        const query = `
            UPDATE request
            SET status = 'Expired'
            WHERE datetime(time_to_live) <= datetime('now', '-2 days')
            RETURNING *;
        `;

        const result = await db.query(query);

        return result.length >= 1;
    } catch (error) {
        console.error("Error approving request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function closeRequest(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'Expired'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error closing request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function approveRequest(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'Accepted'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error setting status:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function handleShipBook(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'Shipped'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error setting status:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function handleShipmentReceive(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'ShipmentReceived'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error setting status:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function rejectRequest(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'Rejected'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error rejecting request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function declinePayment(requestId) {
    try {
        const query = `
            UPDATE request
            SET status = 'PaymentDeclined'
            WHERE id = ?
            RETURNING *;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        return result.length === 1;
    } catch (error) {
        console.error("Error declining payment request:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}
async function getLenderIdByListingId(listingId) {
    try {
        const query = `
            SELECT owner_id
            FROM book_listing
            WHERE id = ?;
        `;

        const values = [listingId];

        const result = await db.query(query, values);

        if (result.length === 1) {
            const lenderId = result[0].owner_id;
            console.log("Lender ID retrieved successfully:", lenderId);
            return lenderId;
        } else {
            console.log("Listing not found.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving lender ID:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}

async function getBorrowerIdFromRequestId(requestId) {
    try {
        const query = `
            SELECT borrower_id
            FROM request
            WHERE id = ?;
        `;

        const values = [requestId];

        const result = await db.query(query, values);

        if (result.length === 1) {
            console.log(result[0]);
            const BorrowerId = result[0].borrower_id;
            console.log("Borrower ID retrieved successfully:", BorrowerId);
            return BorrowerId;
        } else {
            console.log("Listing not found.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving Borrower ID:", error);
        throw error; // Re-throw the error to handle it at a higher level if needed.
    }
}
module.exports = {
    getLenderIdByListingId,
    raiseBorrowRequest,
    getPendingActionsByLenderId,
    getPendingActionsByBorrowerId,
    invalidateOldRequests,
    approveRequest,
    rejectRequest,
    closeRequest,
    getBorrowerIdFromRequestId,
    declinePayment,
    handleShipBook,
    handleShipmentReceive,
};
