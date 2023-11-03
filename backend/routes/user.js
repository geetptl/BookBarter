const userService = require("../services/user");
const Router = require("express-promise-router");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const is_auth = req.body.is_auth;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await userService.create(
            user_id,
            hashedPassword,
            email,
            phone_number,
            first_name,
            last_name,
            latitude,
            longitude,
            is_auth,
        );
        console.log("newUser");
        console.log(newUser);
        if (newUser) {
            res.status(200).json({ "User Created": "True" });
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

router.put('/update/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const is_auth = req.body.is_auth;

    try {
        const updatedUser = await userService.updateUserInfo(user_id, email, phone_number, first_name, last_name, latitude, longitude, is_auth);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ "error": "User not found" });
        } else if (error.message === 'Duplicate email or phone number found') {
            res.status(400).json({ "error": "Duplicate email or phone number found" });
        } else {
            res.status(500).json({ "error": "Server error" });
        }
    }
});

router.put('/update/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const is_auth = req.body.is_auth;

    try {
        const updatedUser = await userService.updateUserInfo(user_id, email, phone_number, first_name, last_name, latitude, longitude, is_auth);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ "error": "User not found" });
        } else if (error.message === 'Duplicate email or phone number found') {
            res.status(400).json({ "error": "Duplicate email or phone number found" });
        } else {
            res.status(500).json({ "error": "Server error" });
        }
    }
});



router.post("/login", async (req, res) => {
    const user_id = req.body.user_id;
    const password = req.body.password_hash;

    try {
        const loggedInUser = await userService.login(user_id, password);
        if (loggedInUser) {
            res.status(200).json({ "User Login": "True" });
        } else {
            res.status(400).json({ "User Login": "False" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/getUsername/:userId', async (req, res) => {
    const id = req.params.userId;

    try {
        const result = await userService.getUsername(id);
        if (result) {
            res.status(200).json({ "User ID": result });
        }
        else {
            res.status(400).json({ "User Login": "No User Exists" });
        }

    } catch(error) {
        res.status(500).json({ "error": "Server error" });
    }
});

module.exports = router;
