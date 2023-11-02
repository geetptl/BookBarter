const listingService = require("../services/booklisting");
const Router = require("express-promise-router");
const express = require("express");
const router = express.Router();

//Registered User adding their listings
router.post("/createListing", async (req, res) => {
    const newListing = await listingService.createNewListing(req.body);
    if (newListing) {
        res.status(200).json({ "listingCreated": "True" }); // Status code 200 for success
    } else {
        res.status(400).json({ "listingCreated": "False" }); // Status code 400 for bad request
    }
});

router.get("/getBookName/:id", async (req, res) => {
    const validBook = await listingService.getBookName(req.params.id);
    console.log(validBook);
    if (validBook) {
        res.send(validBook);
    } else {
        res.status(404).send("Invalid id");
    }
});

router.get("/getBookName/:id", async (req, res) => {
    const validBook = await listingService.getBookName(req.params.id);
    console.log(validBook);
    if (validBook) {
        res.send(validBook);
    } else {
        res.status(404).send("Invalid id");
    }
});

module.exports = router;
