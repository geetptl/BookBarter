const request = require("supertest");
const app = require("../index");
const requestService = require("../services/requests");
const db = require("../db");

fdescribe("Request Routes", () => {

    let token = null;

    beforeAll(async () => {
        
        const mockUser = {
            user_id: "user1",
            password_hash: "user1",
        };

        const res = await request(app)
            .post("/user/login")
            .send(mockUser);

        if(res.status == 200){
            token = res.body.token;
        }
        
    });

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
                borrowDuration: 3,
            };

            // Mock the database query response
            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('book_listing')) {
                    return {
                        rowCount: 1,
                        rows: [{owner_id: 3}]
                    };
                } else {
                    return {
                        rowCount: 1
                    }
                }
            });
            
            const res = await request(app)
                .post("/requests/raiseBorrowRequest")
                .send(mockRequestPayload)
                .set("authorization", token);

            expect(res.status).toBe(201);
        });

        it("should fail when the listing does not exist", async () => {
            const mockRequestPayload = {
                borrowerId: 1,
                listingId: 999, // Assuming this listing does not exist
                borrowDuration: 3,
            };

            // Mock the database query response
            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('book_listing')) {
                    return {
                        rowCount: 0
                    };
                }
            });


            const res = await request(app)
                .post("/requests/raiseBorrowRequest")
                .send(mockRequestPayload)
                .set("authorization", token);

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
                .send(mockRequestPayload)
                .set("authorization", token);

            expect(res.status).toBe(400); // Assuming your route sends a 400 for bad input. Adjust accordingly.
        });
    });

    describe("GET /getPendingActions", () => {

        it("should retrieve the list of pending actions for a user", async () => {
            // Mock response for getPendingActionsByLenderId
            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('lender_id')) {
                return [
                    {
                    id: 6,
                    borrower_id: 4,
                    lender_id: 1,
                    book_listing_id: 1,
                    borrow_duration: 7,
                    status: "Pending"
                    }
                ];
                } else if (query.includes('borrower_id')) {
                return [
                    {
                    id: 2,
                    borrower_id: 1,
                    lender_id: 3,
                    book_listing_id: 5,
                    borrow_duration: 3,
                    status: 'Accepted'
                    },
                    {
                    id: 4,
                    borrower_id: 1,
                    lender_id: 4,
                    book_listing_id: 7,
                    borrow_duration: 9,
                    status: 'Rejected'
                    }
                ];
                }
            });
          
            // Add more expectations as needed
            const res = await request(app).get("/requests/getPendingActions").set("authorization", token);
            
            expect(res.status).toBe(200);
          });


        it("should retrieve no pending actions for a user", async () => {

            // Mock response for getPendingActionsByLenderId
            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('lender_id')) {
                    return [];
                } else if (query.includes('borrower_id')) {
                    return [];
                }
            });
            const res = await request(app).get("/requests/getPendingActions").set("authorization", token);
    
            expect(res.status).toBe(200);
        });
        
        it("should retrieve no pending actions for a user only as a lender", async () => {
            
            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('lender_id')) {
                    return [
                        {
                          id: 6,
                          borrower_id: 4,
                          lender_id: 1,
                          book_listing_id: 1,
                          borrow_duration: 7,
                          status: "Pending"
                        }
                      ];
                } else if (query.includes('borrower_id')) {
                    return [];
                }
            });
    
            const res = await request(app).get("/requests/getPendingActions").set("authorization", token);
    
            expect(res.status).toBe(200);
        });

        it("should retrieve no pending actions for a user only as a Borrower", async () => {

            spyOn(db, 'query').and.callFake((query, values) => {
                if (query.includes('lender_id')) {
                    return [];
                } else if (query.includes('borrower_id')) {
                    return [
                        {
                          id: 6,
                          borrower_id: 4,
                          lender_id: 1,
                          book_listing_id: 1,
                          borrow_duration: 7,
                          status: "Pending"
                        }
                      ];
                }
            });
    
            const res = await request(app).get("/requests/getPendingActions").set("authorization", token);
    
            expect(res.status).toBe(200);
        });
    });

    describe("PUT /approveRequest", () => {

          
        it("should set request status to approved", async () => {
            const mockRequestPayload = {
                requestId: 6,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 1, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .put("/requests/approveRequest")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });


        it("should check if request exists before setting status to approved", async () => {
            const mockRequestPayload = {
                requestId: 9999,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .put("/requests/approveRequest")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(404);
        });

    });


    describe("PUT /rejectRequest", () => {
        it("should request status to rejected", async () => {
            const mockRequestPayload = {
                requestId: 6,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 1, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);

            const res = await request(app)
                .put("/requests/rejectRequest")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });

        it("should check if request exists before setting status to rejected", async () => {
            const mockRequestPayload = {
                requestId: 9999,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .put("/requests/rejectRequest")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(404);
        });

    });

    describe("PUT /declinePayment", () => {

          
        it("should set request status to PaymentDeclined", async () => {
            const mockRequestPayload = {
                requestId: 6,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 1, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .put("/requests/declinePayment")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(200);
        });


        it("should check if request exists before setting status to PaymentDeclined", async () => {
            const mockRequestPayload = {
                requestId: 9999,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .put("/requests/declinePayment")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(404);
        });

    });


    describe('DELETE /invalidateOldRequests', () => {
        it('should invalidate old requests and return true when requests are found', async () => {
            
            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 3, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);

            const res = await request(app).delete("/requests/invalidateOldRequests").set("authorization", token);
            
            expect(res.status).toBe(204);
        });

        it('should invalidate old requests and return true even when no requests are found', async () => {
            
            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);

            const res = await request(app).delete("/requests/invalidateOldRequests").set("authorization", token);
            
            expect(res.status).toBe(204);
        });
    });

    describe('DELETE /closeRequest', () => {
        it('should close rejected/payment declined request and return true if success', async () => {
            
            const mockRequestPayload = {
                requestId: 3,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 1, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .delete("/requests/closeRequest")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(204);
        });

        it('should return false and raise 404 if requestId doesnt exist', async () => {
            
            const mockRequestPayload = {
                requestId: 9999,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .delete("/requests/setStatusToExpired")
                .set("authorization", token)
                .send(mockRequestPayload);

            expect(res.status).toBe(404);
        });
    });

    describe("GET /getBorrowerIdFromRequestId", () => {

        it("should get borrower id from request id successfully", async () => {
            const mockRequestPayload = {
                requestId: 6,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 1, // Simulate a successful query execution
                rows: [{borrower_id: 3}]
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .get(`/requests/getBorrowerIdFromRequestId/${mockRequestPayload.requestId}`)
                .set("authorization", token);

            expect(res.status).toBe(200);
        });


        it("should check if request exists before getting borrower id", async () => {
            const mockRequestPayload = {
                requestId: 9999,
            };

            // Mock the database query response
            const mockQueryResponse = {
                rowCount: 0, // Simulate a successful query execution
            };

            spyOn(db, 'query').and.returnValue(mockQueryResponse);
            
            const res = await request(app)
                .get(`/requests/getBorrowerIdFromRequestId/${mockRequestPayload.requestId}`)
                .set("authorization", token);

            expect(res.status).toBe(200);
        });

    });

});
