const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const serveIndex = require("serve-index");
const multer = require("multer");

const books = require("./libs/books");
const aeneas = require("./libs/aeneas");

app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));

app.post('/upload/:folder', function (req, res) {
    // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.

    const book_name = req.params['folder'];

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Folder designated by the input files html file.
            const dir = `./public/uploads/${book_name}/`;
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

    script_done = upload(req, res, async function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        return await aeneas.call_aeneas(book_name);
    });

    // reload the webpage when the aeneas script is done working on the smil files
    if (script_done) {
        console.log(script_done);
        res.redirect("/");
    }
});

app.get("/", async function (req, res) {
    res.render("index.ejs", { zip_files: await books.get_books() });
});

module.exports = app;