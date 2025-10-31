const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("profile", { user: user });
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  if (!user) return res.status(404).send("User not found");
  let { title, content } = req.body;
  let newPost = await postModel.create({
    user: user._id,
    title,
    content,
  });
  user.posts.push(newPost._id);
  await user.save();
  res.redirect("/profile");
});

// Toggle like on a post
app.post("/post/:postId/like", isLoggedIn, async (req, res) => {
  const { postId } = req.params;
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) return res.status(404).send("User not found");

  const post = await postModel.findById(postId);
  if (!post) return res.status(404).send("Post not found");

  const userIdStr = String(user._id);
  const index = post.likes.findIndex((id) => String(id) === userIdStr);
  if (index === -1) {
    post.likes.push(user._id);
  } else {
    post.likes.splice(index, 1);
  }
  await post.save();
  res.redirect("/profile");
});

// Render edit page
app.get("/post/:postId/edit", isLoggedIn, async (req, res) => {
  const { postId } = req.params;
  const post = await postModel.findById(postId);
  if (!post) return res.status(404).send("Post not found");

  // Only owner can edit
  if (String(post.user) !== String(req.user.user_id)) {
    return res.status(403).send("Forbidden");
  }
  res.render("edit", { post });
});

// Handle edit submit
app.post("/post/:postId/edit", isLoggedIn, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const post = await postModel.findById(postId);
  if (!post) return res.status(404).send("Post not found");
  if (String(post.user) !== String(req.user.user_id)) {
    return res.status(403).send("Forbidden");
  }
  post.title = title;
  post.content = content;
  await post.save();
  res.redirect("/profile");
});

// Delete a post
app.post("/post/:postId/delete", isLoggedIn, async (req, res) => {
  const { postId } = req.params;
  const post = await postModel.findById(postId);
  if (!post) return res.status(404).send("Post not found");
  if (String(post.user) !== String(req.user.user_id)) {
    return res.status(403).send("Forbidden");
  }

  await postModel.deleteOne({ _id: postId });

  // Remove from user's posts array
  await userModel.updateOne({ _id: post.user }, { $pull: { posts: post._id } });

  res.redirect("/profile");
});

app.post("/register", async (req, res) => {
  let { name, username, age, password, email } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) return res.send("User already exists");
  let salt = bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        name,
        username,
        age,
        password: hash,
        email,
      });
      let token = jwt.sign(
        { user_id: createdUser._id, email: email },
        "secretkey"
      );
      res.cookie("token", token);
      res.send("User created successfully");
    });
  });
});

app.post("/login", async (req, res) => {
  let { password, email } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) return res.send("Something went wrong");

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ user_id: user._id, email: email }, "secretkey");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    } else res.send("Wrong password");
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  // If no token exists, redirect to login
  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verify token
    const data = jwt.verify(token, "secretkey");
    req.user = data; // store payload in req.user
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    // Clear invalid token and redirect
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
