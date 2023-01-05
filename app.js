const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https');
const client = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
client.setConfig({apiKey: "c7c910c016ee33d32c348116868865c0-us21",  server: "us21",});
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address : email,
        status : "subscribed",
        merge_fields:{
          FNAME: firstname,
          LNAME: lastname
      }

      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/4adb219f6d";
  const options = {
    method: "POST",
    auth: "blaxman:c7c910c016ee33d32c348116868865c0-us21"
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");

    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  })
  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server running");
});

// api key
// c7c910c016ee33d32c348116868865c0-us21

// audience id
// 4adb219f6d
