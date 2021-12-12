const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const multer = require('multer')
const Busboy = require('busboy');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');


//requiring the models
const Post = require('./models/postmodel');
const Feature = require('./models/featuremodel');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
      user: "conquerorraj2626@outlook.com",
      pass: "Mohanraj@2626"
  }
});

app.get('/',  async (req,res)=>{
  
    const postArticles = await Post.find({}).sort({ createdAt: 'desc' });
    const trendingArticles = await Post.find({}).sort({views: -1}).limit(3);
    const featureArticles = await Feature.find({});

    res.render('index',{Posts:postArticles,Trends:trendingArticles,Features:featureArticles});
});

app.get('/compose',(req,res)=>{
  res.render('compose')
})

app.get('/userArticle',(req,res)=>{
  res.render('userArticle');
});

app.post('/userArticle',(req,res)=>{
  console.log("Posting starts")
  var busboy = new Busboy({ headers: req.headers });
  var attachments = [];  

  const options = {
    from: "conquerorraj2626@outlook.com", // sender address
    to: "conquerorraj2626@gmail.com", // list of receivers
    subject: "New Article", // Subject line
    text: `from: ${req.body.fname} ${req.body.lname}`, // plain text body
    html: req.body.name,
  }
  busboy
        .on('file', function(fieldname, file, filename, encoding, mimetype){
            attachments.push({
               filename: filename,
               content: file.toString('base64'),
               encoding: 'base64'
            });
        })
        .on('finish', function() {
            options.attachments = attachments;
            transporter.sendMail(options, function (err, info) {
               if (err) {
                   console.log(err);
               }
                console.log("Sent:  ", info.response);
                res.Send("You have successfully sent me mail");
           });
        });
});

app.post('/compose',upload.single('image'),(req,res)=>{
  console.log(req.body.posttype);
  if(req.body.posttype == 'main'){
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
     res.redirect('/');
  
    } else{
    
      const post = new Feature({
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
    res.redirect('/');
  }
});

app.get('/:reqid',(req,res)=>{
  const id = req.params.reqid;

    Feature.findById(id,(err,foundItem)=>{
      if(foundItem != null){
        res.render('post',{Post:foundItem})
      }else{
        Post.findById(id,(err,post)=>{
          if(post != null){
              Post.findByIdAndUpdate(id, {views:post.views+1}, ()=>{console.log("views changed")}); 
              res.render('post',{Post:post})
          }
        })
      }
    })
})


app.listen(3000,()=>console.log("server started on port 3000"))