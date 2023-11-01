const listingService = require("../services/booklisting");
const Router = require("express-promise-router");
const express = require('express');
const router = express.Router();

router.post('/createListing', async (req, res) => {
    const newListing = await listingService.createNewListing(req.body);
    res.status(200);
    res.end(JSON.stringify(newListing));
});

module.exports = router;