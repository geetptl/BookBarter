// requestSpec.js

const request = require('supertest');
const app = require('../index'); // Please replace with the path to your Express app entry point
const requestService = require("../services/requests");

describe("Request Routes", () => {
    
    describe("GET /test", () => {
        it("should return a successful test message", async () => {
            const res = await request(app).get("/requests/test");
            expect(res.status).toBe(200);
            expect(res.text).toBe("Test working");
        });
    });

    // describe("POST /raiseBorrowRequest", () => {
    //     it("should raise a borrow request", async () => {
    //         const mockRequestPayload = {
    //             borrowerId: "sampleBorrowerId",
    //             borrowDuration: "1 week",
    //             listingId: "sampleListingId"
    //         };
    //         spyOn(requestService, 'getLenderIdByListingId').and.returnValue("sampleLenderId");
    //         spyOn(requestService, 'raiseBorrowRequest').and.returnValue(true);

    //         const res = await request(app).post("/raiseBorrowRequest").send(mockRequestPayload);

    //         expect(res.status).toBe(200);
    //         expect(res.body).toEqual({ "Request Raised": "Success" });
    //     });

    //     // You can add more test cases, for instance, for handling errors or other conditions
    // });

    describe("GET /getPendingActions", () => {
        it("should retrieve the list of pending actions for a user", async () => {
            const mockUserId = "1";
            spyOn(requestService, 'getPendingActionsByLenderId').and.returnValue([]);
            spyOn(requestService, 'getPendingActionsByBorrowerId').and.returnValue([]);

            const res = await request(app).get("/getPendingActions").send({ userId: mockUserId });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ "Requests": [] });
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });

    // Similarly, create tests for other endpoints ("/invalidateOldRequests", "/approveRequest", "/rejectRequest")

});

