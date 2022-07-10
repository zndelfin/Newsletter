const express = require("express");
const request = require("request");
const https = require("https");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  //res.send("<h1>Hello " + firstName + " " + lastName + "!" + " Your email "+ email + " has been added to my mailing list </h1>");

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data); //data to send to MailChimp

  const url = "https://us8.api.mailchimp.com/3.0/lists/e8fc717592";

  const options = {
    method: "POST",
    auth: "aika:35123ec9f7d608ea60646258619d44c5-us8"
  }

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

    //const statusCode = jsonData.status_code;

  //   https.get(url, function(response){
  //
  //   //console.log(response.statusCode);
  // });

  });


  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started on port 3000");
});

//API KEY
//35123ec9f7d608ea60646258619d44c5-us8

//Audience List ID
// e8fc717592
