const listingService = require("../services/booklisting");
const Router = require("express-promise-router");
const express = require('express');
const router = express.Router();

//Registered User adding their listings
router.post('/createListing', async (req, res) => {

    const newListing = await listingService.createNewListing(req.body);
    if (newListing) {
        res.status(200).json({ "Request Raised": "True" }); // Status code 200 for success
    } else {
        res.status(400).json({ "Request Raised": "False" }); // Status code 400 for bad request
    }
});

module.exports = router;