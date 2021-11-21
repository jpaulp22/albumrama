require("dotenv").config();
const axios = require("axios");
//const cors = require("cors");
const express = require("express");

const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;

let searchval = "";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(cors());

app.listen(port, function() {
  console.log('App is running on port: ' + port);
})

app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get("/", function(req, res) {
  res.render("index");
})

app.post('/api', function (req, res) {
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
    //need to stringify json?
  })()  
})
