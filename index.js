
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

/* ======================
   MongoDB Connection
====================== */

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB Error:",err));

/* ======================
   Schema
====================== */

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  message:String
});

const User = mongoose.model("User",userSchema);

/* ======================
   Resend Setup
====================== */

const resend = new Resend(process.env.RESEND_API_KEY);

/* ======================
   Routes
====================== */

app.get("/",(req,res)=>{
  res.send("Resend Mail API Working");
});


/* Send Email */

app.post("/sendmail",async(req,res)=>{

  try{

    const {name,email,message} = req.body;

    /* Save user data */

    const newUser = new User({name,email,message});
    await newUser.save();

    /* Send Email */

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "vickramsingle@gmail.com",
      subject: "Welcome Mail",
      html: `<p>Hello <strong>${name}</strong>, your message has been received successfully.</p>`
    });

    console.log("Email Response:",response);

    res.json({
      status:true,
      message:"Email sent successfully"
    });

  }catch(error){

    console.log("EMAIL ERROR:",error);

    res.status(500).json({
      status:false,
      error:error.message
    });

  }

});

/* ======================
   Server Start
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});