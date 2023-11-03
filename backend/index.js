require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = 8000;

app.use(cors());

routes.mountRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening on ${port}`);
});

module.exports = app;
