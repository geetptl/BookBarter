const request = require("supertest");
const app = require("../index");
const requestService = require("../services/requests");
const userService = require("../services/user");
const bcrypt = require("bcrypt");
const db = require("../db");

fdescribe("Request Routes", () => {
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
    describe("POST /login", () => {

        it("should successfully log in a user with valid credentials", async () => {
            const mockUser = {
                user_id: "user1",
                password_hash: "user1",
            };

            // spyOn function to mock the login method of the userService. 
            // Instead of calling the actual login method, Jasmine will replace it with a spy function that you can control in your test.
            spyOn(userService, "login").and.returnValue(Promise.resolve(mockUser));

            const res = await request(app)
                .post("/user/login")
                .send(mockUser);

            expect(res.status).toBe(200);
        });

        it("should reject login with incorrect password", async () => {
            const mockUser = {
                user_id: "user1",
                password_hash: "wrongPassword",
            };

            // Promise with the mockUser object, we are resolving it with null. 
            spyOn(userService, "login").and.returnValue(Promise.resolve(null));
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

            spyOn(userService, "login").and.returnValue(Promise.resolve(null));
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


    describe("POST /update", () => {
        it("should update user information successfully", async () => {
            const mockUser = {
                user_id: "newUser",
                password_hash: "newUserPassword",
                email: "newuser@example.com",
                phone_number: "1234567890",
                first_name: "New1",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };

            // Mocking the userService.updateUserInfo method
            spyOn(userService, "updateUserInfo").and.returnValue(Promise.resolve(mockUser));

            const res = await request(app)
                .post("/user/update").set("authorization", token)
                .send(mockUser);

            expect(res.status).toBe(200);
        });

        it("should handle 'User not found' error", async () => {
            const mockUser = {
                user_id: "nonexistentUser",
                email: "newemail@example.com",
                phone_number: "1234567890",
                first_name: "Neww",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
    
            // Mocking the userService.updateUserInfo method to throw 'User not found' error
            spyOn(userService, "updateUserInfo").and.throwError(new Error('User not found'));
    
            const res = await request(app)
                .post("/user/update").set("authorization", token)
                .send(mockUser);
    
            // Expectations
            expect(res.status).toBe(404);
            expect(res.body).toEqual({ "error": "User not found" });
        });

        it("should handle 'Duplicate email or phone number found' error", async () => {
            const mockUser = {
                user_id: "user1",
                email: "existing@example.com",
                phone_number: "1234567890",
                first_name: "Neww",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
    
            // Mocking the userService.updateUserInfo method to throw 'Duplicate email or phone number found' error
            spyOn(userService, "updateUserInfo").and.throwError(new Error('Duplicate email or phone number found'));
    
            const res = await request(app)
                .post("/user/update").set("authorization", token)
                .send(mockUser);
    
            // Expectations
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ "error": "Duplicate email or phone number found" });
        });

        it("should handle other errors with a 500 status", async () => {
            const mockUser = {
                user_id: "user1",
                email: "newemail@example.com",
                phone_number: "1234567890",
                first_name: "Neww",
                last_name: "User",
                latitude: 123.456,
                longitude: 789.012,
                is_auth: true,
            };
    
            spyOn(userService, "updateUserInfo").and.throwError(new Error('Some other error'));
    
            const res = await request(app)
                .post("/user/update").set("authorization", token)
                .send(mockUser);
    
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ "error": "Server error" });
        });

        
    })
});