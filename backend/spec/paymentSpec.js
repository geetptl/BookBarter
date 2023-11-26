const request = require("supertest");
const app = require("../index");
const paymentService = require("../services/payment");
const db = require("../db");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);




fdescribe("Payment Routes", () => {

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
    // Mock Stripe's functions
    beforeEach(() => {
        spyOn(stripe.customers, 'create').and.returnValue(Promise.resolve({ id: 'customer_id' }));
        spyOn(stripe.paymentMethods, 'retrieve').and.returnValue(Promise.resolve({ card: { last4: '1234' } }));
        spyOn(stripe.paymentIntents, 'create').and.returnValue(Promise.resolve({ id: 'payment_intent_id', status: 'Success' }));
        // Add more mocks as necessary for other Stripe functions
    });
    
    describe("GET /payment/test", () => {
        it("should return a successful test message", async () => {
            const res = await request(app).get("/payment/test");
            expect(res.status).toBe(200);
            expect(res.text).toBe("Test working");
        });
    });

    describe("POST /payment/card/add", () => {
        // Assuming authentication is handled and token is available

        it("should successfully add a card", async () => {
            // Mock the request body
            const cardData = {
                email: "user1@email.com",
                paymentMethodId: "pm_1OGn01JvFHmzlX92IsTZ28YJ",
                userId: "user1"
            };

            // Mock Stripe and other service calls here

            const res = await request(app)
                .post("/payment/card/add")
                .set("Authorization", `Bearer ${token}`)
                .send(cardData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Card added successfully");
            // Additional assertions as necessary
        });

        it("should handle errors when adding a card fails", async () => {
            // Mock request body and service calls to simulate failure

            const res = await request(app)
                .post("/payment/card/add")
                .set("Authorization", `Bearer ${token}`)
                .send({}); // Invalid or incomplete data

            expect(res.status).toBe(500);
        });
    });
});