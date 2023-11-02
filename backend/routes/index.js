const user = require("./user");
const status = require("./status");
const search = require("./search");
const requests = require("./requests");
<<<<<<< Updated upstream
const booklisting = require("./booklisting")
=======
const book = require("./book");
const payment = require("./payment")

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    app.use("/booklisting", booklisting);


=======
    app.use("/book", book);
    app.use("/payment", payment);
>>>>>>> Stashed changes
};

module.exports = { mountRoutes };
