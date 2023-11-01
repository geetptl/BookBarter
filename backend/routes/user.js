const userService = require("../services/user");
const Router = require("express-promise-router");
const express = require('express');
const router = express.Router();

router.get("/id/:id", async (req, res) => {
    const validUser = await userService.validateUserId(req.params.id);
    if (validUser) {
        res.send(`Found user with id ${req.params.id}`);
    } else {
        res.status(404).send("Invalid id");
    }
});

router.route('homepage').post()

router.post('/create', async (req, res) => {
    const newUser = await userService.create(req.body);
    res.status(200);
    res.end(JSON.stringify(newUser));
});

module.exports = router;
