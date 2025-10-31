const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mydatabase");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  age: Number,
  email: String,
  password: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }], // Add this line
});

const User = mongoose.model("user", userSchema);

module.exports = User;
