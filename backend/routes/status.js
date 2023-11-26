const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

router.get(["/", "/node", "/nodejs"], async (req, res) => {
    res.send("node.js server is running");
});

router.get("/postgres", async (req, res) => {
    try {
        const result = await db.query("SELECT 1+1;");
        if (result) {
            res.send("postgres is connected");
        } else {
            res.send("postgres is not connected");
        }
    } catch (error) {
        console.log(error);
        res.send("postgres is not connected");
    }
});

module.exports = router;
