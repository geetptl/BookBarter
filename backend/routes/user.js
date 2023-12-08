const userService = require("../services/user");
const Router = require("express-promise-router");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

router.get("/id/:id", async (req, res) => {
    const validUser = await userService.validateUserId(req.params.id);
    if (validUser) {
        res.send(`Found user with id ${req.params.id}`);
    } else {
        res.status(404).send("Invalid id");
    }
});

router.post("/create", async (req, res) => {
    const user_id = req.body.user_id;
    const password = req.body.password_hash;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const address = req.body.address;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    let latitude = req.body.latitude || 0;
    let longitude = req.body.longitude || 0;
    const is_auth = req.body.is_auth;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        const phoneRegex = /^\d{10}$/;
        const isPhoneValid = phoneRegex.test(phone_number);
        const userIdRegex = /^[a-zA-Z0-9!._]{4,20}$/;
        const isUserIdValid = userIdRegex.test(user_id);
        
        if(!isUserIdValid){
        console.log("user invalid");
        res.status(400).json({
            "User Created": "False",  
            error: "User ID is not valid! Please enter a valid username, 4-20 characters long with alphanumeric characters and/or any of these symbols [!,.,\'_\']",
        });
        return;
    }

        if (!isPhoneValid) {
            console.log("phone invalid");
            res.status(400).json({
                "User Created": "False",
                error: "Phone number is not valid!",
            });
            return;
        }

        if (!isEmailValid) {
            console.log("email invalid");
            res.status(400).json({
                "User Created": "False",
                error: "Email invalid",
            });
            return;
        }

        coordinates = await userService.validateAddress(address);
        if (!coordinates) {
            console.log("invalid address");
            res.status(404).json({
                success: false,
                message: "Address not found",
            });
            return;
        } else {
            latitude = coordinates.latitude;
            longitude = coordinates.longitude;
        }

        const newUser = await userService.create(
            user_id,
            hashedPassword,
            email,
            phone_number,
            address,
            first_name,
            last_name,
            latitude,
            longitude,
            is_auth,
        );
        if (newUser) {
            res.status(201).json({ "User Created": "True" });
        }
    } catch (error) {
        if (
            error.message ===
            "User with the same user_id, email or phone number already exists"
        ) {
            res.status(400).json({
                "User Created": "False",
                error: "User with the same user_id, email or phone number already exists",
            });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

router.post("/getUpdateDetails", requireAuth, async (req, res) => {
    try {
        const user_id = req.user_session.user.user_id;
        const query = `SELECT * FROM USERS WHERE user_id = ?`;
        const result = await db.query(query, [user_id]);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/update", requireAuth, async (req, res) => {
    var userId = req.user_session.user.id;
    if (!userId) {
        res.status(404).json({ error: "Unauthorized User" });
    }
    const user_id = req.body.user_id;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const address = req.body.address;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    let latitude = req.body.latitude || 0;
    let longitude = req.body.longitude || 0;
    const is_auth = req.body.is_auth;
    const password = req.body.password;
    console.log("NEW PASSWORD", password);
    console.log(userId);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        const phoneRegex = /^\d{10}$/;
        const isPhoneValid = phoneRegex.test(phone_number);
        const userIdRegex = /^[a-zA-Z0-9!._]{4,20}$/;
        const isUserIdValid = userIdRegex.test(user_id);

        if (!isUserIdValid) {
            console.log("user invalid");
            res.status(400).json({
                "User Updated": "False",
                error: "User ID is not valid! Please enter a valid username, 4-20 characters long with alphanumeric characters and/or any of these symbols [!,.,'_']",
            });
            return;
        }

        if (!isPhoneValid) {
            console.log("phone invalid");
            res.status(400).json({
                "User Updated": "False",
                error: "Phone number is not valid!",
            });
            return;
        }

        if (!isEmailValid) {
            console.log("email invalid");
            res.status(400).json({
                "User Updated": "False",
                error: "Email invalid",
            });
            return;
        }

        coordinates = await userService.validateAddress(address);
        if (!coordinates) {
            console.log("invalid address");
            res.status(404).json({
                success: false,
                message: "Address not found",
            });
            return;
        } else {
            latitude = coordinates.latitude;
            longitude = coordinates.longitude;
        }

        const updatedUser = await userService.updateUserInfo(
            user_id,
            email,
            phone_number,
            address,
            first_name,
            last_name,
            latitude,
            longitude,
            is_auth,
            hashedPassword,
        );
        res.status(200).json(updatedUser);
        console.log("The updated user is" + updatedUser);
    } catch (error) {
        console.log(error);

        if (error.message === "User not found") {
            res.status(404).json({ error: "User not found" });
        } else if (error.message === "Duplicate email or phone number found") {
            res.status(400).json({
                error: "Duplicate email or phone number found",
            });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

router.post("/login", async (req, res) => {
    const user_id = req.body.user_id;
    const password = req.body.password_hash;

    try {
        const loggedInUser = await userService.login(user_id, password);
        console.log(loggedInUser);
        if (loggedInUser) {
            const token = jwt.sign(
                { user: loggedInUser },
                process.env.JWT_KEY,
                { expiresIn: process.env.JWT_EXPIRESIN },
            );

            const options = {
                httpOnly: true,
                secure: false,
                path: "/",
            };
            const cookieString = `token=${token}; HttpOnly; Secure=${options.secure}; Path=${options.path}`;
            res.setHeader("Set-Cookie", cookieString);
            // Send the response here after setting the cookie.
            res.status(200).json({ "User Login": "True", token: token });
        } else {
            res.status(400).json({ "User Login": "False" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getUsername/:userId", async (req, res) => {
    const id = req.params.userId;

    try {
        const result = await userService.getUsername(id);
        if (result) {
            res.status(200).json({ "User ID": result });
        } else {
            res.status(400).json({ "User Login": "No User Exists" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/getUserDetails/:userID", requireAuth, async (req, res) => {
    const userID = req.params.userID;
    console.log(userID);
    try {
        const result = await userService.getUserDetails(userID);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ "User Details": "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getFirstname/:userId", async (req, res) => {
    const id = req.params.userId;

    try {
        const result = await userService.getUserFirstName(id);
        if (result) {
            console.log(result);
            res.status(200).json(result);
        } else {
            res.status(400).json({ "User Login": "No User Exists" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getUserDetailsforAdmin",requireAuth,async (req, res) => {
    try {
        var userId = req.user_session.user.id
        if(userId) {
            console.log("User id is valid");
        const getAdminresult = await userService.getAdmin(userId);
        if(!getAdminresult)  
        {  
        console.log("User is not admin");
        res.status(404).json({ "error": "Unauthorized User" });
        }
        else{
        const getUserInfo = await userService.getUserInfo();
        res.status(200).json(getUserInfo);
        }}
        else{
            res.status(404).json({ "error": "Unauthorized User" });

        }  
    }
     catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getRequestDetailsforAdmin",requireAuth,async (req, res) => {
    try {
        var userId = req.user_session.user.id
        if(userId) {
        console.log("User id is valid");
        const getAdminresult = await userService.getAdmin(userId);
        if(!getAdminresult)
        {console.log("User is not admin");
        res.status(404).json({ "error": "Unauthorized User" });
        } 
        else{
        const getRequestInfo = await userService.getRequestInfo();
        res.status(200).json(getRequestInfo);
        }}
        else{
            res.status(404).json({ "error": "Unauthorized User" });
        }
    } catch (error) {   
        console.error("Error retrieving requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getAdmin",requireAuth,async (req, res) => {
    try {
        console.log("hello");
        console.log(req);
        var userId = req.user_session.user.id 
        if(userId) {
        console.log("User id is valid");
        const getAdminresult = await userService.getAdmin(userId);
        if(!getAdminresult)
        {res.status(200).json({"message":"User is not admin"});
        }
        else{
            res.status(200).json({"message":"User is admin"});
        }
    }} catch (error) {   
        console.error("Error retrieving requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.delete("/deleteUser", requireAuth, async (req, res) => {
    var userId = req.user_session.user.id;
    try { 
        userService.deleteUserById(userId);
        res.status(204).json({ "User Deleted": "Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error while processing the request" });
    }
});



router.delete("/deleteUserByAdmin", requireAuth, async (req, res) => {
    var userIdToDelete = req.body.userId;
    try { 
       userService.deleteUserById(userIdToDelete);
        res.status(204).json({ "User Deleted": "Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error while processing the request" });
    }
});


module.exports = router;
