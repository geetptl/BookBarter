const express = require("express");
const bookService = require("../services/book");
const router = express.Router();

router.get("/get/:bookId", async (req, res) => {
    const bookData = await bookService.getById(req.params.bookId);

    if (bookData) {
        res.json(bookData);
    } else {
        res.status(404).json({ errMessage: "Requested book not found!" });
    }
});

module.exports = router;
