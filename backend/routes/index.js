const user = require("./user");
const status = require("./status");
const search = require("./search");

const mountRoutes = (app) => {
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/user", user);
    app.use("/status", status);
    app.use("/search", search);
};

module.exports = { mountRoutes };
