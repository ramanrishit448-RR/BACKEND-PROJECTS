const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/myFirstRoute/:id", (req, res) => {
  res.send(`Welcome ${req.params.id}`);
});

app.get("/myFirstRoute/:id/:age", (req, res) => {
  res.send(`welcome, ${req.params.id} of age ${req.params.age}`);
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
