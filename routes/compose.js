const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer = require("multer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
require('dotenv').config()

const Post = require("../models/postmodel");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });



router.get("/", (req, res) => {
    res.render("compose-new-article");
  });
  
router.post("/", upload.single("image"), (req, res) => {
    console.log(req.body.category);
    const post = new Post({
      fname: req.body.fname,
      lname: req.body.lname,
      title: req.body.heading,
      subtitle: req.body.subheading,
      views: 0,
      category: req.body.category,
      img: {
        data: fs.readFileSync(
          path.join(process.cwd() + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
      markdown: req.body.markdown,
    });
  
    post.save((err) => {
      if (!err) {
        console.log("no problem saved successfully");
      } else {
        console.log(err);
      }
    });
    res.redirect("/");
  });

  module.exports = router;