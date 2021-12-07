const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const multer = require('multer')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const fs = require('fs');
const path = require('path');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/newblogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  fname:String,
  lname:String,
  title:String,
  subtitle:String,
  img:
  {
    data: Buffer,
    contentType: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

postSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
  }
  next()
})

const Post =  mongoose.model('Post', postSchema); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });


app.get('/',(req,res)=>{ 
    Post.find({},(err,result)=>{
        if(!err){
            res.render('index',{Posts:result});
        }
    })
  });

app.get('/compose',(req,res)=>{
  res.render('compose')
})

app.post('/compose',upload.single('image'),(req,res)=>{

  const post = new Post({
    fname : req.body.fname,
    lname : req.body.lname,
    title : req.body.heading,
    subtitle : req.body.subheading,
    content : req.body.post, 
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    },
    markdown:req.body.markdown
  });

  post.save((err)=>{
    if(!err){
      console.log("no problem saved successfully")
    }else{
      console.log(err)
    }
  });
  res.redirect('/')
})

app.get('/post',(req,res)=>{
    res.render("post")
})
app.get('/posts/:reqid',(req,res)=>{
    const id = req.params.reqid;
    Post.findById(id,(err,post)=>{
        if(!err){
            res.render('post',{Post:post})
        }
    })
})

app.listen(3000,()=>console.log("server started on port 3000"))