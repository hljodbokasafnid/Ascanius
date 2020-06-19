const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const serveIndex = require("serve-index");
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));

app.get("/", function(req, res) {
    res.render("index.ejs");
});

const spawn = require("child_process").spawn;

const process = spawn('python', ['./test.py']);

process.stdout.on('data', (data) => {
    console.log(data.toString());
});

module.exports = app;