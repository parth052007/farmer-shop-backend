import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🛒 PLACE ORDER (CUSTOMER)
router.post("/place", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

// 📦 GET CUSTOMER ORDERS
router.get("/customer/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.email": req.params.email
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🌾 GET FARMER ORDERS
router.get("/farmer/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      farmerEmail: req.params.email
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔄 UPDATE ORDER STATUS
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

export default router;
