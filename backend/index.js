const express = require("express");
const routes = require("./routes");

const app = express();
const port = 8000;

routes.mountRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening on ${port}`);
});
