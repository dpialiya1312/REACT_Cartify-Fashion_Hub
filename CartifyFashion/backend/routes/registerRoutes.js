import Feedback from "../models/Feedback.js";
import Contact from "../models/Contact.js";
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import process from "node:process";

const router = express.Router();

// ✅ DEBUG (yaha add karo)
console.log("EMAIL:", process.env.SMTP_USER);
console.log("PASS:", process.env.SMTP_PASS);


// ✅ MAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();
    const phone = req.body.phone;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found ❌" });
    }

    console.log("HASH:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password ❌" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "1d"
    });

    res.json({
      message: "Login successful ✅",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= UPDATE PROFILE =================
router.put("/update-profile", async (req, res) => {
  try {
    const { id, name, phone, gender, address, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone, gender, address, image },
      { new: true }
    );

    res.json({
      message: "Profile Updated ✅",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= CHANGE PASSWORD =================
router.put("/change-password", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { id, currentPassword, newPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found ❌" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 🔥 CREATE TRANSPORTER HERE (IMPORTANT FIX)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email 📩" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error ❌" });
  }
});

// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ error: "Invalid OTP ❌" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ error: "OTP expired ⏰" });
    }

    res.json({ message: "OTP verified ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= RESET PASSWORD =================
router.put("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("REQUEST:", { email, otp });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found ❌" });
    }

    console.log("DB OTP:", user.resetOTP);
    console.log("REQUEST OTP:", otp);

    // 🔥 IMPORTANT FIX: convert both to string
    const dbOtp = String(user.resetOTP);
    const reqOtp = String(otp);

    if (dbOtp !== reqOtp) {
      return res.status(400).json({ error: "Invalid OTP ❌" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ error: "OTP expired ⏳" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpire = null;

    await user.save();

    return res.json({ message: "Password reset successful ✅" });

  } catch (error) {
    console.error("RESET ERROR:", error);
    return res.status(500).json({ error: "Server error ❌" });
  }
});


// ================= CONTACT =================
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }

    console.log("BODY RECEIVED:", req.body);

    // ✅ SAVE IN MONGODB
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    console.log("CONTACT SAVED:", newContact);

    res.status(200).json({
      message: "Message saved successfully ✅"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error ❌" });
  }
});


//feedback
router.post("/feedback", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
     console.log(req.body); // check
   const newFeedback = new Feedback({
      name,
      email,
      rating: Number(rating),   // 🔥 MUST
      message,
    });

    await newFeedback.save();

    res.json({ message: "Feedback saved successfully ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


                                                //admin routes

// ================= GET ALL CONTACTS =================
router.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete contact message api add
router.delete("/contact/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error ❌" });
  }
});

//EMAIL REPLY SYSTEM (Nodemailer) Add backend route:
router.post("/contact/reply", async (req, res) => {
  try {
    const { email, message } = req.body;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reply from Admin",
      text: message,
    });

    res.json({ message: "Reply sent ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email failed ❌" });
  }
});


// ================= GET ALL FEEDBACKS =================
router.get("/feedback", async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= DELETE FEEDBACK =================
router.delete("/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*get users*/
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE USER =================
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found ❌" });
    }

    res.json({ message: "User deleted successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error ❌" });
  }
});


// ✅ VERY IMPORTANT (LAST LINE)
export default router;