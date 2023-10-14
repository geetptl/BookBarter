const user = require("./user");
const status = require("./status");

const mountRoutes = (app) => {
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/user", user);
    app.use("/status", status);
};

module.exports = { mountRoutes };
