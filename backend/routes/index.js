const user = require("./user");
const status = require("./status");
const search = require("./search");
const requests = require("./requests");
const booklisting = require("./booklisting");
const express = require("express");

const mountRoutes = (app) => {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Hello, world!");
    });

    app.use("/user", user);
    app.use("/status", status);
    app.use("/search", search);
    app.use("/requests", requests);
    app.use("/booklisting", booklisting);
};

module.exports = { mountRoutes };
