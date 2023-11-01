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

    describe("POST /raiseBorrowRequest", () => {
        it("should raise a borrow request", async () => {
            const mockRequestPayload = {
                borrowerId: 1,
                listingId: 3,
                borrowDuration: "3"
            };
            spyOn(requestService, 'getLenderIdByListingId').and.returnValue(3);
            // spyOn(requestService, 'raiseBorrowRequest').and.returnValue(true);

            const res = await request(app).post("/requests/raiseBorrowRequest").send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });

    describe("GET /getPendingActions", () => {
        it("should retrieve the list of pending actions for a user", async () => {
            const mockUserId = "1";
            spyOn(requestService, 'getPendingActionsByLenderId').and.returnValue([]);
            spyOn(requestService, 'getPendingActionsByBorrowerId').and.returnValue([]);

            const res = await request(app).get("/requests/getPendingActions").send({ userId: mockUserId });
            
            console.log(res.body)
            expect(res.status).toBe(200);
            // expect(res.body).toEqual({ "Requests": [] });
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });

    describe("PUT /approveRequest", () => {
        it("should request status to approved", async () => {
            const mockRequestPayload = {
                requestId: 3
            };
            const res = await request(app).put("/requests/approveRequest").send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });

    describe("PUT /rejectRequest", () => {
        it("should request status to rejected", async () => {
            const mockRequestPayload = {
                requestId: 1
            };
            const res = await request(app).put("/requests/rejectRequest").send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });
    describe('PUT /invalidateOldRequests', () => {
        it('should invalidate old requests and return true when requests are found', async () => {
    
            const res = await request(app).put("/requests/invalidateOldRequests");
            
            expect(res.status).toBe(200);
        });
    
    });
    // Similarly, create tests for other endpoints ("/invalidateOldRequests", "/approveRequest", "/rejectRequest")

});

