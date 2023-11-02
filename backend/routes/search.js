const searchService = require("../services/search");
const Router = require("express-promise-router");

const router = new Router();

router.get("/query", async (req, res) => {
    const keywords = req.query.keywords;
    const page = req.query.page || 1;
    const limit = req.query.limit || 18;
    console.log(page);
    console.log(limit);
    console.log(keywords);
    const filteredBooks = await searchService.filterBooks(keywords, page, limit);
    if (filteredBooks) {
        res.json(filteredBooks);
    } else {
        res.json([]);
    }
});

router.get("/all", async (req, res) => {
    res.json(books);
});

module.exports = router;
