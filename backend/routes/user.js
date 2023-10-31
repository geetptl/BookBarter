const userService = require("../services/user");
const Router = require("express-promise-router");

const router = new Router();

router.get("/id/:id", async (req, res) => {
    const validUser = await userService.validateUserId(req.params.id);
    if (validUser) {
        res.send(`Found user with id ${req.params.id}`);
    } else {
        res.status(404).send("Invalid id");
    }
});

module.exports = router;
