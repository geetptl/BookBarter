const express = require("express");
const userService = require("../services/user");

var router = express.Router();

router.get("/id/:id", (req, res) => {
    if (userService.validateUserId(req.params.id)) {
        res.send(`Finding user with id ${req.params.id}`);
    } else {
        res.status(404).send("Invalid id");
    }
});

module.exports = router;
