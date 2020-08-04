const express = require("express");
const app = express();

const path = require("path");
const public = path.join(__dirname, "public");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const fs = require("fs");
const serveIndex = require("serve-index");
const multer = require("multer");

// Handles getting the smil zip files ready for the client
const books = require("./libs/books");
// Uses websocket.io to relay the output from the python aeneas (main.py) to the client
const aeneas = require("./libs/aeneas");
// Uses websocket.io to relay the output from the python aeneas (main.py) to the client
const convert = require("./libs/convert");

app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(public));
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));
app.use(favicon("./public/images/favicon.ico"));

app.post('/upload/:folder', async function (req, res) {
  // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.

  const book_name = req.params['folder'];

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = "";
      if (file['originalname'].split(".")[1].match(/jpg|png|jpeg|svg|gif/)) {
        // If we have a jpg image we send it to images folder
        dir = `./public/uploads/${book_name}/images`;
      } else {
        // Folder designated by the input files html file.
        dir = `./public/uploads/${book_name}/`;
      }
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
    // If upload finishes then the client will emit a socket io message.
    // Nothing more needs to be done here.
  });
});

app.post('/upload_convert/:folder', async function (req, res) {
  // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.

  const book_name = req.params['folder'];

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = "";
      if (file['originalname'].split(".")[1].match(/jpg|png|jpeg|svg|gif/)) {
        // If we have a jpg image we send it to images folder
        dir = `./public/uploads/${book_name}/images`;
      } else {
        // Folder designated by the input files html file.
        dir = `./public/uploads/${book_name}/`;
      }
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
    // If upload finishes then the client will emit a socket io message.
    // Nothing more needs to be done here.
  });
});

app.get("/", async function (req, res) {
  res.render("index.ejs", { zip_files: await books.getBooks("zip"), active: "smil" });
});

app.get("/convert", async function (req, res) {
  res.render("convert.ejs", { epub_files: await books.getBooks("epub"), active: "convert" });
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { active: "about" });
});

module.exports = app;