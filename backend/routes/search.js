const searchService = require("../services/search");
const Router = require("express-promise-router");
const path = require("path");
const books = require("../db/books");

const router = new Router();

router.get("/query/:query", async (req, res) => {
    const filteredBooks = await searchService.filterBooks(req.params.query);
    res.json(filteredBooks);
});

router.get("/all", async (req, res) => {
    res.json(books);
});

module.exports = router;
