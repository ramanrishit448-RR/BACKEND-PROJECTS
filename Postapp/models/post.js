const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mydatabase");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
  },
  image: {
    type: String, // public URL path like /uploads/<file>
  },
  date: {
    type: Date,
    default: Date.now,
  },

  content: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const post = mongoose.model("post", postSchema);

module.exports = post;
