const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { console } = require("inspector");

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

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
