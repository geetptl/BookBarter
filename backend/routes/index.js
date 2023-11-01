const user = require("./user");
const status = require("./status");
const search = require("./search");
const exchange = require("./exchange");
const book = require("./book");

const express = require("express");

const mountRoutes = (app) => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/user", user);
    app.use("/status", status);
    app.use("/search", search);
    app.use("/exchange", exchange);
    app.use("/book", book);
};

module.exports = { mountRoutes };
