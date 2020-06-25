const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const shell = require("shelljs");
const serveIndex = require("serve-index");
const books = require("./libs/books");
const multer = require("multer");

app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));

app.post('/upload/:folder', function (req, res) {
    // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Folder designated by the input files html file.
            const dir = `./public/uploads/${req.params['folder']}/`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    // Assign multer with input file fields to upload
    var upload = multer({ storage: storage }).fields([{ name: 'uploads' }]);

    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
    // TODO Call the python scripts and when that is done (async) then call res.end or res.send or res.render to rerender the page, updated.
    res.end("Files uploaded");
});

app.get("/", async function (req, res) {
    res.render("index.ejs", { zip_files: await books.get_books() });
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