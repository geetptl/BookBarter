const searchService = require("../services/search");
const db = require("../db");
const Router = require("express-promise-router");

const router = new Router();

router.get("/query", async (req, res) => {
    const keywords = req.query.keywords;
    const page = req.query.page || 1;
    const limit = req.query.limit || 18;
    const filteredBooks = await searchService.filterBooks(
        keywords,
        page,
        limit,
    );
    if (filteredBooks) {
        res.json(filteredBooks);
    } else {
        res.json([]);
    }
});

router.get("/all", async (req, res) => {
    try {
        const { page = 1, limit = 18 } = req.query;
        const offset = (page - 1) * limit;
        const query = `
            SELECT b.id, SUBSTRING(b.title, 1, 50) as title, b.author, b.rating, b.image_url, g.name AS genre
            FROM book AS b
            INNER JOIN book_genre_mapping AS bgm ON b.id = bgm.book_id
            INNER JOIN genre AS g ON bgm.genre_id = g.id
            ORDER BY b.id
            LIMIT \$1 OFFSET \$2
        `;
        const values = [limit, offset];
        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
