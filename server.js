//requirements
require("dotenv").config();
const axios = require("axios"); //for api calls
const cors = require("cors"); //for html2canvas
const express = require("express"); //server
const session = require('express-session'); //for session
const bodyParser = require("body-parser"); //might not be necessary anymore
const mongoose = require('mongoose'); //for database
const bcrypt = require('bcryptjs'); //to encrypt passwords
const User = require("./models/user"); //schema

//express
const app = express();
const port = process.env.PORT || 5000;

//mongodb
const mongodb = process.env.MONGO_DB;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on("error", () => console.log("Error connecting to database"));
db.once("open", () => console.log("Connected to database"));

//search value for last.fm api call
let searchval = "";

//view engine to serve html, bodyParser for reading json, cors for html2canvas
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: process.env.SESH_KEY,
  cookie: { maxAge: oneDay },
  resave: false,
  saveUninitialized: false
}));

//from where im serving files
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.listen(port, function() {
  console.log('App is running on port: ' + port);
})

//ROUTES 

//homepage
app.get("/", function(req, res) {
  //if user is already logged in via cookie redirect to portal page, else index
  if(req.session.loggedIn){
    res.redirect("portal");
  }
  else{
    res.render('index.html');
  }
})

//last.fm api call
app.post('/', function (req, res) {
  let data = {};
  searchval = req.body.searchval;
  (async () => {
    async function status() {
      const url = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" + searchval + "&api_key=" + process.env.AR_API_KEY + "&format=json";
      const response = await axios.get(url);
      data = response.data;
      res.json(data);
    }
    await status();
  })()  
})

//portal only accessible if signed in using cookie - else must sign in
app.get("/portal", function(req, res){
  if(req.session.loggedIn){
    res.render("portal.html");
  }
  else{
    res.redirect("signin");
  }
})

//sign up page
app.get("/signup", function(req, res){
  res.render("signup.html");
})

//posting new user to database
app.post("/signup", function(req, res){
  let new_user = new User({
    email: req.body.email
  });
  new_user.password = new_user.generateHash(req.body.password);
  new_user.save();
  return res.redirect("signin");
})

//redirect to portal if cookie exists, else signin page
app.get("/signin", function(req, res){
  if(req.session.loggedIn){
    res.redirect("portal");
  }
  else{
    res.render("signin.html");
  }
})

//checking to see if user credentials are correct
app.post("/signin", async function(req, res){
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        req.session.loggedIn = true;
        req.session.email = req.body.email;
        res.redirect("user");
      } else {
        res.redirect("signin");
      }
    } else {
      res.redirect("signin");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
})

//user account page
app.get('/user', async function(req, res){
  res.render("user.html");
})

//gets all grids in databse for this account
app.get('/gridinfo', async function(req, res){
  let loggedEmail = req.session.email;
  console.log(loggedEmail);
  let allGrids = await User.aggregate([{ $match: {email: loggedEmail}}, { $project: {'allgrids': '$grids'}}])
  res.json(allGrids[0]);
})

//to log out go to /logout for now
app.get('/signout', function(req, res){
  res.redirect("/signin");
  req.session.destroy((err)=>{});
})

//saving grid to database
app.post("/save", async function(req,res){
  data = req.body.userArray;
  console.log(data);
  db.collection('users').updateOne({"email" : req.session.email}, {$push:{"grids": data}}, {upsert: false})
})