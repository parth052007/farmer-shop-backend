import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["farmer", "buyer"], required: true },

  // 🔐 FORGOT PASSWORD
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },

  // 🔥 EMAIL OTP (NEW - ADDED ONLY)
  emailOtp: { type: String },
  emailOtpExpiry: { type: Date }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
