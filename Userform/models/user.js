const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mydatabase");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
