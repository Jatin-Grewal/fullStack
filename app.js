//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));

// console.log(process.env.API_KEY);

// database connections.........................................................................................
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

// get requests.................................................................................................
app.get("/",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/login",function(req,res){
    res.render("login");
})

// post requests................................................................................................

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then(function(user,err){
        if(user) res.render("secrets");
        if(err) console.log(err);
    })

})

app.post("/login",function(req,res){
    const usernameTyped = req.body.username;
    const passwordTyped = req.body.password
    User.findOne({email:usernameTyped}).then(function(founduser,err){
        if(err) console.log(err);
        else{
            if(founduser){
                if(founduser.password===passwordTyped){
                    // console.log(founduser.password);
                    res.render("secrets")
                } 
                else res.send("you have typed the wrong password");
            }
        }
    })
})




// listening to the port 3000...................................................................................
app.listen(3000,function(){
    console.log("Server started at port 3000");
})