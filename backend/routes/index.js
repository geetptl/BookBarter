const user = require("./user");
const status = require("./status");
const express = require("express");
const exchange = require("./exchange");

const mountRoutes = (app) => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/user", user);
    app.use("/status", status);
    app.use("/exchange", exchange);
};

module.exports = { mountRoutes };
