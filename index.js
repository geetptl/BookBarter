const http = require("http");
const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

var userRoute = require("./routes/user");
app.use("/user", userRoute);

app.listen(port, () => {
    console.log(`Example app listening on ${port}`);
});
