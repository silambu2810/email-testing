const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ==============================
   MongoDB Connection
============================== */

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));


/* ==============================
   Schema
============================== */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const User = mongoose.model("User", userSchema);


/* ==============================
   Nodemailer Setup
============================== */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* Verify SMTP connection */

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});


/* ==============================
   Routes
============================== */

app.get("/", (req, res) => {
  res.send("Mail API Working");
});


/* Send Mail API */

app.post("/sendmail", async (req, res) => {

  try {

    const { name, email, message } = req.body;

    /* Save to MongoDB */

    const newUser = new User({
      name,
      email,
      message
    });

    await newUser.save();

    /* Mail Options */

    const mailOptions = {
      from: `"Mail Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome Mail",
      text: `Hello ${name}, your message has been received successfully.`
    };

    /* Send Email */

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", info.response);

    res.json({
      status: true,
      message: "User saved and email sent successfully"
    });

  } catch (error) {

    console.log("MAIL ERROR:", error);

    res.status(500).json({
      status: false,
      error: error.message
    });

  }

});


/* ==============================
   Server Start
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});