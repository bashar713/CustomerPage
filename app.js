const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

// to transfer css styles to client pc
app.use(express.static("public"));

// Send HTML page to client pc
app.get("/" , (res , req)=>{

    req.sendFile(__dirname+"/index.html");

});

//Collect data from the user 
app.post("/" , (res,req)=>{
    const fname = res.body.fn;
    const lname = res.body.ln;
    const email = res.body.em;

    //collet user data in Javascript object to translate it to JSON type
    const newData = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    // convert javascript object to JSON 
    const JSONdata = JSON.stringify(newData);

    // mailchimp url 
    var url = " https://us2.api.mailchimp.com/3.0/lists/28a984ff11";

    // What I want to do in mailchimp list (add people , my user name : my password)
    const option = {
        method: "POST",
        auth : "Bashar713:a179e839fc65f324fa7324894fe23d86-us2"
    };

    // make a request to mailchimp and to send them my sub data to post it in a list 
    const request =https.request(url , option , function(resposne){

        if(resposne.statusCode == 200){
            req.sendFile(__dirname+"/success.html");
        }
        else{
            req.sendFile(__dirname+"/failer.html");
        }

        resposne.on("data" , function(data){
            console.log(JSON.parse(data));
        })

    });
    request.write(JSONdata);
    request.end();

})


app.post("/failer" , function(req , res){
    res.redirect("/");
})

//Start server at port 3000
app.listen(process.env.PORT||"3000" , function(){
    console.log("Server Running On Port 3000.");
})


    





//Api Key
//a179e839fc65f324fa7324894fe23d86-us2

//List ID
//28a984ff11

//'https://us2.api.mailchimp.com/3.0/lists/28a984ff11' 
