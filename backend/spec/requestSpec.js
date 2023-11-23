const request = require("supertest");
const app = require("../index");
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
                borrowDuration: "3",
            };
            spyOn(requestService, "getLenderIdByListingId").and.returnValue(3);

            const res = await request(app)
                .post("/requests/raiseBorrowRequest")
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        it("should fail when the listing does not exist", async () => {
            const mockRequestPayload = {
                borrowerId: 1,
                listingId: 999, // Assuming this listing does not exist
                borrowDuration: "3",
            };
            spyOn(requestService, "getLenderIdByListingId").and.returnValue(
                null,
            );

            const res = await request(app)
                .post("/requests/raiseBorrowRequest")
                .send(mockRequestPayload);

            expect(res.status).toBe(404);
        });

        it("should fail when missing parameters", async () => {
            const mockRequestPayload = {
                borrowerId: 1,
                borrowDuration: "3",
                // Missing listingId
            };

            const res = await request(app)
                .post("/requests/raiseBorrowRequest")
                .send(mockRequestPayload);

            expect(res.status).toBe(400); // Assuming your route sends a 400 for bad input. Adjust accordingly.
        });
    });

    describe("GET /getPendingActions", () => {
        it("should retrieve the list of pending actions for a user", async () => {
            const mockUserId = "1";
            // spyOn(requestService, 'getPendingActionsByLenderId').and.returnValue([]);
            // spyOn(requestService, 'getPendingActionsByBorrowerId').and.returnValue([]);
            // spyOn(requestService, 'getPendingActionsByLenderId').and.returnValue([]);
            // spyOn(requestService, 'getPendingActionsByBorrowerId').and.returnValue([]);

            const res = await request(app).get(`/requests/getPendingActions/${mockUserId}`);
            
            console.log(res.body)
            expect(res.status).toBe(200);
        });

        it("should retrieve no pending actions for a user", async () => {
            const mockUserId = "100"; // Assuming this user does not have any requests
            spyOn(requestService, 'getPendingActionsByLenderId').and.returnValue(null);
            spyOn(requestService, 'getPendingActionsByBorrowerId').and.returnValue(null);
    
            const res = await request(app).get(`/requests/getPendingActions/${mockUserId}`);
    
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /approveRequest", () => {
        it("should request status to approved", async () => {
            const mockRequestPayload = {
                requestId: 3,
            };
            const res = await request(app)
                .put("/requests/approveRequest")
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        // You can add more test cases, for instance, for handling errors or other conditions
    });

    describe("PUT /rejectRequest", () => {
        it("should request status to rejected", async () => {
            const mockRequestPayload = {
                requestId: 1,
            };
            const res = await request(app)
                .put("/requests/rejectRequest")
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });
    });
    describe('invalidateOldRequests', () => {
        it('should invalidate old requests and return true when requests are found', async () => {
    
            const res = await request(app).put("/requests/invalidateOldRequests");
            
            expect(res.status).toBe(200);
        });
    });

    // Similarly, create tests for other endpoints ("/invalidateOldRequests", "/approveRequest", "/rejectRequest")

});
