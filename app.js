const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require('dotenv').config()

//requiring mongoose schema
const Post = require("./models/postmodel");

//requiring routes
const userArticle = require("./routes/userArticle");
const compose = require("./routes/compose");
// const posts = require("./routes/posts");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

<<<<<<< HEAD
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
=======
mongoose.connect("mongodb://localhost:27017/newblogDB", {useNewUrlParser: true, useUnifiedTopology:true});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
      user: user,
      pass: Password
  }
>>>>>>> f3ca7c5128c025dd654d6e7cf27e35ef3608119e
});

app.get("/", async (req, res) => {
  const postArticles = await Post.find({ category: "main" }).sort({
    createdAt: "desc",
  });
  const trendingArticles = await Post.find({ category: "main" })
    .sort({ views: -1 })
    .limit(3);
  const featureArticles = await Post.find({ category: "feature" });

  res.render("index", {
    Posts: postArticles,
    Trends: trendingArticles,
    Features: featureArticles,
  });
});

app.use('/userArticle',userArticle);
app.use('/compose-new-article',compose);
// app.use('/article',posts);
app.get("/:reqid", (req, res) => {
  const id = req.params.reqid;
  Post.findById(id, (err, post) => {
    if (post != null) {
      Post.findByIdAndUpdate(id, { views: post.views + 1 }, () => {
        console.log("views changed");
      });
      res.render("post", { Post: post });
    }
  });
});


<<<<<<< HEAD
app.listen(3000, () => console.log("server started on port 3000"));
=======
app.listen(3000,()=>console.log("server started on port 3000"))
>>>>>>> f3ca7c5128c025dd654d6e7cf27e35ef3608119e
