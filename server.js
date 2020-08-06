const express = require("express");
const app = express();

const path = require("path");
const public = path.join(__dirname, "public");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const serveIndex = require("serve-index");
const multer = require("multer");

// Handles getting the output files ready for the client
const books = require("./libs/books");

app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(public));
app.use("/uploads/", serveIndex(__dirname + "/public/uploads/"));
app.use(favicon("./public/images/favicon.ico"));

app.post('/upload/:folder', async function (req, res) {
  // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Get filepath from preserved Path
      var filepath = file['originalname'].split('/').slice(0, -1).join('/');
      var dir = `./public/uploads/${filepath}/`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      // Get the original name (removing the preserved path in front)
      var originalname = file.originalname.split('/').slice(-1).toString();
      cb(null, originalname);
    }
  });

  // Assign multer with input file fields to upload
  var upload = multer({ storage: storage, preservePath: true }).fields([{ name: 'uploads' }]);

  script_done = upload(req, res, async function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    // If upload finishes then the client will emit a socket io message.
    // Nothing more needs to be done here.
  });
});

app.post('/delete',  function (req, res) {
  // Designate storage location dynamically by the folder parameter set in upload.js by looking for the book html file.
  var files = req.body;
  for (var file in files) {
      try {
        var filepath = path.join(__dirname, "public", "output", files[file]);
        if (fs.existsSync(filepath)) {
          // Delete File if it Exists
          fs.remove(filepath);
        }
      } catch(err) {
        console.error(err)
      }
  }
});

app.get("/", async function (req, res) {
  res.render("index.ejs", { files: await books.getBooks("zip"), active: "smil" });
});

app.get("/convert", async function (req, res) {
  res.render("convert.ejs", { files: await books.getBooks("epub"), active: "convert" });
});

app.get("/batchconvert", async function (req, res) {
  res.render("batch_convert.ejs", { files: await books.getBooks("batch.zip"), active: "batchconvert" });
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { active: "about" });
});

module.exports = app;