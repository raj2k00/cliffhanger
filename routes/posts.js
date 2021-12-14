const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const Post = require("../models/postmodel");

router.get("/:reqid", (req, res) => {
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

module.exports = router;