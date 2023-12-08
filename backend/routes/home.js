const statService = require("../services/home");
const Router = require("express-promise-router");
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const db = require("../db");

const router = express.Router();

router.get("/getSuccessfulTransaction", async (req, res) => {
    const countTransactions = await statService.getSuccessfulTransaction(req);
    console.log(countTransactions);
    if (countTransactions) {
        res.send(countTransactions);
    } else {
        res.status(404).json({ "Error": "Query failed"});
    }
});

router.get("/getTopLenders", async (req, res) => {
    const getLenderNames = await statService.getTopLenders(req);
    console.log(getLenderNames);
    if (getLenderNames) {
        res.send(getLenderNames);
    } else {
        res.status(404).json({ "Error": "Query failed"});
    }
});

router.get("/getBooksMaxRequest", async (req, res) => {
    const getBookNames = await statService.getBooksMaxRequest(req);
    console.log(getBookNames);
    if (getBookNames) {
        res.send(getBookNames);
    } else {
        res.status(404).json({ "Error": "Query failed"});
    }
});
module.exports = router;

