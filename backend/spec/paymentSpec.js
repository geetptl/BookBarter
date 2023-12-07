const request = require("supertest");
const app = require("../index");
const paymentService = require("../services/payment");
const db = require("../db");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

describe("Payment Routes", () => {
    let token = null;

    beforeAll(async () => {
        const mockUser = {
            user_id: "user1",
            password_hash: "user1",
        };

        const res = await request(app).post("/user/login").send(mockUser);

        if (res.status == 200) {
            token = res.body.token;
        }
    });

    describe("GET /payment/test", () => {
        it("should return a successful test message", async () => {
            const res = await request(app).get("/payment/test");
            expect(res.status).toBe(200);
            expect(res.text).toBe("Test working");
        });
    });

    describe("POST /payment/card/add", () => {
        let paymentMethodId;

        beforeAll(async () => {
            // Create a payment method using Stripe's test card
            const paymentMethod = await stripe.paymentMethods.create({
                type: "card",
                card: {
                    number: "4242424242424242", // Stripe's test card number
                    exp_month: 12,
                    exp_year: new Date().getFullYear() + 1, // Next year
                    cvc: "123",
                },
            });

            paymentMethodId = paymentMethod.id;
        });

        it("should successfully add a card", async () => {
            // Use the generated paymentMethodId
            const cardData = {
                email: "user2@email.com",
                paymentMethodId: paymentMethodId,
                userId: "user2",
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

        // it("should handle errors when adding a card fails", async () => {
        //     // Mock request body and service calls to simulate failure

        //     const res = await request(app)
        //         .post("/payment/card/add")
        //         .set("Authorization", `Bearer ${token}`)
        //         .send({}); // Invalid or incomplete data

        //     expect(res.status).toBe(500);
        // });
    });
});
