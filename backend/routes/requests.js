const express = require("express");
const requestService = require("../services/requests");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.get("/test", async (req, res) => {
    res.status(200).send("Test working");
});

// Borrower requests an exchange
router.post("/raiseBorrowRequest", requireAuth, async (req, res) => {
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
                status: "Fail",
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
                    res.status(201).json({
                        "status": "Success"
                    }); // Status code 200 for success
                } else {
                    res.status(400).json({
                        "status": "Fail",
                        "Failure Reason": "Failed to create request due to server",
                    }); // Status code 400 for bad request
                }
            } else {
                res.status(404).json({
                    "status": "Listing not found"
                }); // Status code 404 for not found
            }
        }
    } catch (error) {
        console.error("Error while creating borrow request:", error);
        res.status(500).json({
            "status": "Internal Server Error"
        }); // Status code 500 for internal server error
    }
});

router.get("/getPendingActions", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        var pendingActions = [];
        var userId = req.user_session.user.id;

        // Call the getPendingActionsByLenderId service to fetch requests for the lender
        const requestsByLender = await requestService.getPendingActionsByLenderId(userId);

        if (requestsByLender) {
            for (const action of requestsByLender) {
                action.userType = "Lender";
                pendingActions.push(action);
            }
        }

        // Call the getPendingActionsByBorrowerId service to fetch requests for the borrower
        const requestsByBorrower = await requestService.getPendingActionsByBorrowerId(userId);

        if (requestsByBorrower) {
            for (const action of requestsByBorrower) {
                action.userType = "Borrower";
                pendingActions.push(action);
            }
        }
        
        if (pendingActions) {
            res.status(200).json({
                "Actions": pendingActions.sort((a, b) => a.id - b.id)
            });
        } else {
            res.status(200).json({
                "Actions": "No requests found"
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

router.delete("/closeRequest", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the approveRequest service to approve the request
        const result = await requestService.closeRequest(requestId);

        if (result) {
            res.status(204).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

router.delete("/invalidateOldRequests", requireAuth, async (req, res) => {
    try {
        const requests = await requestService.invalidateOldRequests();

        if (requests) {
            res.status(204).json({
                "status": "All requests successfully invalidated",
            });
        } else {
            res.status(204).json({
                "status": "No old requests found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

// Define a route to approve a request
router.put("/approveRequest", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the approveRequest service to approve the request
        const result = await requestService.approveRequest(requestId);

        if (result) {
            res.status(200).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});


// Define a route to approve a request
router.put("/handleShipmentReceive", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the approveRequest service to approve the request
        const result = await requestService.handleShipmentReceive(requestId);

        if (result) {
            res.status(200).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

// Define a route to approve a request
router.put("/handleShipBook", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the approveRequest service to approve the request
        const result = await requestService.handleShipBook(requestId);

        if (result) {
            res.status(200).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

// Define a route to reject a request
router.put("/rejectRequest", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the rejectRequest service to reject the request
        const result = await requestService.rejectRequest(requestId);

        if (result) {
            res.status(200).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});

// Define a route to reject a request
router.put("/declinePayment", requireAuth, async (req, res) => {
    try {
        // Create a list of pending actions for a user both as a borrower and a lender.
        const requestId = parseInt(req.body.requestId, 10);

        if (isNaN(requestId)) {
            return res.status(400).json({
                "status": "Invalid input",
                "message": "Request ID must be a non-empty string."
            });
        }

        // Call the rejectRequest service to reject the request
        const result = await requestService.declinePayment(requestId);

        if (result) {
            res.status(200).json({
                "status": "Success"
            });
        } else {
            res.status(404).json({
                "status": "Request not found",
            });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({
            "status": "Error"
        });
    }
});


router.get("/getBorrowerIdFromRequestId/:requestId", requireAuth, async (req, res) => {
    try {
            // Create a list of pending actions for a user both as a borrower and a lender.
            const requestId = parseInt(req.params.requestId, 10);

            if (isNaN(requestId)) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Invalid requestId format. requestId must be an integer.",
                });
            }

            // Call the getPendingActionsByLenderId service to fetch requests for the lender
            const borrowerId = await requestService.getBorrowerIdFromRequestId(requestId);

            if (borrowerId) {
                console.log("borrowerId",borrowerId)
                res.status(200).json({
                    status: "Success",
                    borrowerId: borrowerId,
                });
            } else {
                res.status(200).json({
                    status: "Not Found",
                });
            }
        } catch (error) {
            console.error("Error handling request:", error);
            res.status(500).json({
                status: "Error",
            });
        }
    },
);

module.exports = router;
