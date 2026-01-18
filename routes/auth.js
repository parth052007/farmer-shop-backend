import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// 🔥 OTP EMAIL SENDER IMPORT (NEW)
import sendOtpEmail from "../utils/sendOtpEmail.js";

const router = express.Router();

/* ================= SEND OTP (NEW) ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        email,
        emailOtp: otp,
        emailOtpExpiry: Date.now() + 5 * 60 * 1000
      },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address, otp } = req.body;

    if (!otp)
      return res.status(400).json({ message: "OTP required" });

    const userWithOtp = await User.findOne({
      email,
      emailOtp: otp,
      emailOtpExpiry: { $gt: Date.now() }
    });

    if (!userWithOtp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);

    userWithOtp.name = name;
    userWithOtp.password = hashedPassword;
    userWithOtp.phone = phone;
    userWithOtp.address = address;
    userWithOtp.role = role;
    userWithOtp.emailOtp = undefined;
    userWithOtp.emailOtpExpiry = undefined;

    await userWithOtp.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥🔥 ONLY CHANGE IS HERE
    res.status(200).json({
      success: true,     // ✅ ADDED
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.status(200).json({
      message: "Reset link generated",
      resetLink: `http://localhost:3000/reset-password/${resetToken}`
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
