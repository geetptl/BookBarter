const express = require("express");
const exchangeService = require("../services/exchange");
const router = express.Router();
const path = require("path");

router.get("/test", async (req, res) => {
    res.status(200).send("Test working");
});

// Borrower requests an exchange
router.post("/listingId/:listingId", async (req, res) => {
    try {
        const borrowerId = req.body.borrowerId;
        const borrowDuration = req.body.borrowDuration;

        const listingId = req.params.listingId;

        console.log(borrowerId)
        console.log(borrowDuration)
        console.log(listingId)
        // Retrieve lender_id using the getLenderIdByListingId function
        const lenderId = await exchangeService.getLenderIdByListingId(listingId);

        if (lenderId !== null) {
            // Now, you have the lender_id, you can proceed to create the request
            const result = await exchangeService.raiseRequest(borrowerId, lenderId, listingId);

            if (result) {
                res.status(200).json({ "Request Raised": "True" }); // Status code 200 for success
            } else {
                res.status(400).json({ "Request Raised": "False" }); // Status code 400 for bad request
            }
        } else {
            res.status(404).json({ "Request Raised": "Lender not found" }); // Status code 404 for not found
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Raised": "Error" }); // Status code 500 for internal server error
    }
});

router.get("/getRequests", async (req, res) => {
    try {
        const lenderId = req.body.lenderId;

        // Call the getRequests service to fetch requests for the lender
        const requests = await exchangeService.getRequestsByLender(lenderId);

        if (requests) {
            res.status(200).json({ requests });
        } else {
            res.status(200).json({ "Requests": "No requests found" });
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
        const result = await exchangeService.approveRequest(requestId);

        if (result) {
            res.status(200).json({ "Request Approved": "True" });
        } else {
            res.status(404).json({ "Request Approved": "Request not found" });
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
        const result = await exchangeService.rejectRequest(requestId);

        if (result) {
            res.status(200).json({ "Request Rejected": "True" });
        } else {
            res.status(404).json({ "Request Rejected": "Request not found" });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ "Request Rejected": "Error" });
    }
});

module.exports = router;