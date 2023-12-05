const searchService = require("../services/search");
const db = require("../db");
const Router = require("express-promise-router");

const router = new Router();

router.get("/query", async (req, res) => {
    try {
        const keywords = req.query.keywords;
        const page = req.query.page || 1;
        const limit = req.query.limit || 18;
        const filteredBooks = await searchService.filterBooks(keywords, page, limit);
        if (filteredBooks) {
            res.json(filteredBooks);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 18;
        const result = await searchService.filterBooks(null, page, limit);
        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
