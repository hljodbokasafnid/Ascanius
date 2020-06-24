const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const shell = require("shelljs");
const formidable = require("formidable");
const formidableMiddleware = require('express-formidable');
const serveIndex = require("serve-index");
const books = require("./libs/books");

app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));

app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: __dirname + "/public/uploads/",
    multiples: true,
}));

app.get("/", async function (req, res) {
    res.render("index.ejs", { zip_files: await books.get_books() });
});

app.post("/upload", async function (req, res) {

    // Get the html name, make a new folder with same name

    // If the folder does not exist, make it

    // Write the uploaded files to the folder

    // Start the processing etc.

    // if (!fs.existsSync()) {
    //     shell.mkdir("-p", path)
    // }
    // return res.render("index.ejs", { zip_files: await books.get_books() });
});

// const spawn = require("child_process").spawn;

// const process = spawn('python3', ['./main.py', 'bok1']);

// var responseData = "";

// process.stdout.on('data', function (data){
//     responseData += data.toString();
//     console.log(data);
// });

// process.stderr.on('data', function (data){
//     responseData += 'err: ' + data.toString();
//     console.log(responseData);
// });

module.exports = app;