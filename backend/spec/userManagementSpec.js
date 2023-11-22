const request = require("supertest");
const app = require("../index");
const requestService = require("../services/requests");
const userService = require("../services/user");
const bcrypt = require("bcrypt");
const db = require("../db");

describe("Request Routes", () => {
    describe("POST /login", () => {

        // it("should successfully log in a user with valid credentials", async () => {
        //     const mockUser = {
        //         user_id: "desmond",
        //         password_hash: "desmond123",
        //     };
        //     const res = await request(app)
        //         .post("/user/login")
        //         .send(mockUser);

        //     expect(res.status).toBe(200);
        //     expect(res.body).toEqual({ "User Login": "True" });
        // });
        
        it("should reject login with incorrect password", async () => {
            const mockUser = {
                user_id: "desmond",
                password_hash: "wrongPassword",
            };
            const res = await request(app)
                .post("/user/login")
                .send(mockUser);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ "User Login": "False" });
        });

        it("should reject login when the user is not found", async () => {
            const mockUser = {
                user_id: "nonExistentUser",
                password_hash: "somePassword",
            };
            const res = await request(app)
                .post("/user/login")
                .send(mockUser);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ "User Login": "False" });
        });

        it("should handle server errors during login", async () => {
            const mockUser = {
                user_id: "desmond",
                password_hash: "desmond123",
            };
            spyOn(userService, "login").and.throwError("Database error");

            const res = await request(app)
                .post("/user/login")
                .send(mockUser);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Server error" });
        });


    });

    describe("POST /create", () => {
        it("should successfully create a user with valid data", async () => {
            const mockUser = {
                user_id: "newUser",
                password_hash: "newUserPassword",
                email: "newuser@example.com",
                phone_number: "1234567890",
                first_name: "New",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
            spyOn(bcrypt, "hash").and.returnValue("hashedPassword");
            spyOn(userService, "create").and.returnValue(true);

            const res = await request(app)
                .post("/user/create")
                .send(mockUser);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ "User Created": "True" });
        });

        it("should reject user creation with existing user_id, email, or phone number", async () => {
            const mockUser = {
                user_id: "existingUser",
                password_hash: "existingUserPassword",
                email: "existing@example.com",
                phone_number: "1234567890", // Existing phone number
                first_name: "Existing",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
            spyOn(bcrypt, "hash").and.returnValue("hashedPassword");
            spyOn(userService, "create").and.throwError("User with the same user_id, email or phone number already exists");

            const res = await request(app)
                .post("/user/create")
                .send(mockUser);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                "User Created": "False",
                error: "User with the same user_id, email or phone number already exists",
            });
        });

        it("should handle server errors during user creation", async () => {
            const mockUser = {
                user_id: "newUser",
                password_hash: "newUserPassword",
                email: "newuser@example.com",
                phone_number: "1234567890",
                first_name: "New",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
            spyOn(bcrypt, "hash").and.returnValue("hashedPassword");
            spyOn(userService, "create").and.throwError("Server error");

            const res = await request(app)
                .post("/user/create")
                .send(mockUser);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: "Server error" });
        });
    });      

});