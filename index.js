const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB Connection */
mongoose.connect("mongodb+srv://auxiliumhostelmanagement_db_user:Auxilium9944@hmsdb.gdmebh2.mongodb.net/mailDB?appName=HMSDB")
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log(err));

/* Schema */
const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  message:String
});

const User = mongoose.model("User",userSchema);

/* Nodemailer Setup */
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"vickramsingle@gmail.com",
    pass:"sjbd yyna azdk crrx"
  }
});

/* Home Route */
app.get("/",(req,res)=>{
  res.send("Mail API Working");
});

/* Register + Send Mail */
app.post("/sendmail", async(req,res)=>{

  try{

    const {name,email,message} = req.body;

    const newUser = new User({
      name,
      email,
      message
    });

    await newUser.save();

    const mailOptions = {
      from:"yourgmail@gmail.com",
      to:email,
      subject:"Welcome Mail",
      text:`Hello ${name}, Your message received successfully`
    };

    await transporter.sendMail(mailOptions);

    res.json({
      status:true,
      message:"User saved and email sent"
    });

  }catch(error){
    res.status(500).json({error:error.message});
  }

});

app.listen(5000,()=>{
  console.log("Server running on port 5000");
});