const User = require("../models/User.model.js");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const registerAction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    let user = await User.create(req.body);
    return res
      .status(201)
      .json({ message: "User Registered Successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", error: error.message });
  }
};

const logInAction = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Unauthorized User" });

    let encryptedPassword = user.password;
    let isValid = await User.checkPassword(password, encryptedPassword);
    if (!isValid) return res.status(401).json({ error: "Invalid Password" });

    user.password = undefined;

    return res.status(200).json({
      message: "Sign in successfully",
      user,
      email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateToken = (userId, role) => {
  let payload = { id: userId, role: role }; // You can set the role based on your logic,
  let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

const logOutAction = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout." });
  }
};

const forgotPassword = async (req, res, next) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
     tls: {
      rejectUnauthorized: false, // ✅ Fix for self-signed certificate error
    },
  });
   

  var mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Request to Create new Password",
    html: `<div class=container style= 'height: 200px; max-width: 600px background-color:rgb(53, 54, 53);font-family: Arial, sans-serif; color:rgb(247, 242, 242) border:1px solid rgb(213, 221, 213); margin: 0 auto; padding: 20px'>
           <p1 style='font-size: 16px; margin-bottom: 20px'>Hey ${req.body.email}</p1><br>
           <p2 style= 'font-size: 15px; margin-bottom: 30px;  line-height: 1.6;'>
           we have received a request to create a new password from your account.<br>If you did not make this request please ignore this email.</p2><br>
           <a href='http://localhost:3000/user/create-new-password?email=${req.body.email}'>
           <button  style='background-color:rgb(32, 110, 124)01, 237); color: #000; text-align: center; padding: 12px 20px; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold '> Create New Password</button></a><br>
           <p4 style = 'font-size: 12px; color: #ccc; margin-top: 20px; padding-top: 15px'> Thanks and Regards<br>Excel-Analytic Team</p4>
        </div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
       return res.status(500).json({ message: "Failed to send email", error });
    } else {
      console.log("✅ Email sent: " + info.response);
      return res.status(200).json({ message: "Email sent successfully" });
    }
  });
};

const createNewPassword = async (req, res, next) => {
  let { email, password } = req.body;
  User.updateOne({ email }, { $set: { password } })
    .then((result) => {
      console.log(result);
      return res
        .status(201)
        .json({ message: " Password Updated Successfully..." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Erroe", err });
    });
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("token");
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    return res
      .status(500)
      .json({ error: "Server error during account deletion" });
  }
};

module.exports = {
  registerAction,
  logInAction,
  logOutAction,
  forgotPassword,
  createNewPassword,
  generateToken,
  deleteAccount,
};
