const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

router.get(["/", "/node", "/nodejs"], async (req, res) => {
    res.send("node.js server is running");
});

router.get("/sqlite", async (req, res) => {
    try {
        const result = await db.query("SELECT 1+1;");
        if (result) {
            res.send("sqlite is connected");
        } else {
            res.send("sqlite is not connected");
        }
    } catch (error) {
        console.log(error);
        res.send("postgres is not connected");
    }
});

module.exports = router;
