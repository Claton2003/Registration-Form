const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app=express ()
dotenv.config();

const port=process.env.port || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.4eezqob.mongodb.net/registrationFormDB`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema=new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        const existinguser=await Registration.findOne({email:email});
        //check for existing user
        if(!existinguser){
            const RegistrationData=new Registration({
                name,
                email,
                password
            });
            await RegistrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exists");
            res.redirect("/error");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})