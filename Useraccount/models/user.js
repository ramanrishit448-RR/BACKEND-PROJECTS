const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mydatabase");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
