const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join(" ")}.txt`,
    req.body.note,
    (err) => {
      res.redirect("/");
    }
  );
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    res.render("show", { filename: req.params.filename, data: data });
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    res.render("edit", { filename: req.params.filename, data: data });
  });
});

app.post("/edit", function (req, res) {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.newName}`,
    function (err) {
      if (err) {
        console.log("ERROR: " + err);
      }
      res.redirect("/");
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
