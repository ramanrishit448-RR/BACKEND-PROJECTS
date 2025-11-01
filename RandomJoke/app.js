const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { joke: null });
});

app.post("/joke", async (req, res) => {
  try {
    const getjokeUrl = "https://official-joke-api.appspot.com/jokes/random";
    const response = await axios.get(getjokeUrl);
    const joke = response.data; // axios automatically parses JSON to object
    res.render("index", { joke: joke });
  } catch (error) {
    console.log("Error:", error);
    res.render("index", { joke: null, error: "Failed to fetch joke" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
