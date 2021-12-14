const mongoose = require("mongoose");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const postSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  title: String,
  subtitle: String,
  views:Number,
  category:{
    type:String,
    required:true,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

postSchema.pre("validate", function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
