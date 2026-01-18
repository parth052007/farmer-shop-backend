import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🔄 UPDATE PROFILE
router.put("/update/:id", async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body); // 🔥 ADD THIS

    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;
