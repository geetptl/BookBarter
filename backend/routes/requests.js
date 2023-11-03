const express = require("express");
const requestService = require("../services/requests");
const requireAuth = require("../middleware/requireAuth");
const currentUser = require("../middleware/currentUser");
const router = express.Router();

router.get("/test", async (req, res) => {
    res.status(200).send("Test working");
});

// Borrower requests an exchange
router.post("/raiseBorrowRequest", async (req, res) => {
    try {
        const borrowerId = req.body.borrowerId;
        const borrowDuration = req.body.borrowDuration;
        const listingId = req.body.listingId;

        if (
            borrowerId === undefined ||
            borrowDuration === undefined ||
            listingId == undefined
        ) {
            res.status(400).json({
                "Request Raised": "Fail",
                "Failure Reason": "Invalid Parameters",
            }); // Status code 400 for bad request
        } else {
            // Retrieve lender_id using the getLenderIdByListingId function
            const lenderId =
                await requestService.getLenderIdByListingId(listingId);
            console.log(lenderId);
            if (lenderId !== null) {
                // Now, you have the lender_id, you can proceed to create the request
                const result = await requestService.raiseBorrowRequest(
                    borrowerId,
                    lenderId,
                    listingId,
                    borrowDuration,
                );

                if (result) {
                    res.status(200).json({ "Request Raised": "Success" }); // Status code 200 for success
                } else {
                    res.status(400).json({
                        "Request Raised": "Fail",
                        "Failure Reason":
                            "Failed to create request due to server",
                    }); // Status code 400 for bad request
                }
            } else {
                res.status(404).json({ "Request Raised": "Listing not found" }); // Status code 404 for not found
            }
        }
    } catch (error) {
        console.error("Error while creating borrow request:", error);
        res.status(500).json({ Error: "Internal Server Error" }); // Status code 500 for internal server error
    }
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNSwiY3JlYXRlZF9vbiI6IjIwMjMtMTEtMDJUMDA6MTg6MjUuNjQyWiIsImxhc3RfdXBkYXRlZF9vbiI6IjIwMjMtMTEtMDJUMDA6MTg6MjUuNjQyWiIsInVzZXJfaWQiOiJqaGFuYXZpIiwicGFzc3dvcmRfaGFzaCI6IiQyYiQxMCRFLzZacTJWYWN6VnUxNG13TUh4dm5PZXRtak9JcnU3RDdFZVB5RW5FMkplNFRzWDUuT0NNQyIsImVtYWlsIjoiamhhbmF2aUBydXRnZXJzLmVkdSIsInBob25lX251bWJlciI6IjEyMzQiLCJmaXJzdF9uYW1lIjoiamhhbmF2aSIsImxhc3RfbmFtZSI6IlEiLCJsYXRpdHVkZSI6IjE1LjAwMDAwMCIsImxvbmdpdHVkZSI6IjI1LjAwMDAwMCIsImlzX2F1dGgiOmZhbHNlfSwiaWF0IjoxNjk4ODk2NTA2LCJleHAiOjE2OTg5MDAxMDZ9.h-r8I5Rz87QMxnYTRaD4vmj2NNBuNHWUZw75P5ZWBUg


router.get("/getPendingActions/:userId", async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        var pendingActions = [];
        const userId = req.params.userId;

        // Call the getPendingActionsByLenderId service to fetch requests for the lender
        const requestsByLender =
            await requestService.getPendingActionsByLenderId(userId);

        // Call the getPendingActionsByBorrowerId service to fetch requests for the borrower
        const requestsByBorrower =
            await requestService.getPendingActionsByBorrowerId(userId);

        if (requestsByLender) {
            pendingActions.push({ asLender: requestsByLender });
        }

        if (requestsByBorrower) {
            pendingActions.push({ asBorrower: requestsByBorrower });
        }

        if (pendingActions) {
            res.status(200).json({ Requests: pendingActions });
        } else {
            res.status(200).json({ Requests: "No requests found" });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Raised": "Error" });
    }
});

router.put("/invalidateOldRequests", async (req, res) => {
    try {
        const requests = await requestService.invalidateOldRequests();

        if (requests) {
            res.status(200).json({
                "Request invalidation status":
                    "All requests successfully invalidated",
            });
        } else {
            res.status(200).json({
                "Request invalidation status": "No old requests found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Raised": "Error" });
    }
});

// Define a route to approve a request
router.put("/approveRequest", async (req, res) => {
    try {
        const requestId = req.body.requestId;

        // Call the approveRequest service to approve the request
        const result = await requestService.approveRequest(requestId);

        if (result) {
            res.status(200).json({ "Request approval status": "Success" });
        } else {
            res.status(404).json({
                "Request approval status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Approved": "Error" });
    }
});

// Define a route to reject a request
router.put("/rejectRequest", async (req, res) => {
    try {
        const requestId = req.body.requestId;

        // Call the rejectRequest service to reject the request
        const result = await requestService.rejectRequest(requestId);

        if (result) {
            res.status(200).json({ "Request rejection status": "Success" });
        } else {
            res.status(404).json({
                "Request rejection status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Rejected": "Error" });
    }
});

module.exports = router;
