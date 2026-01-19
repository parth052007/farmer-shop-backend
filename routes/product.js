import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ➕ ADD PRODUCT
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // 🔥 FIX: frontend expects direct product
    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📦 GET ALL PRODUCTS
// 📦 GET APPROVED PRODUCTS (CUSTOMER)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🕒 GET PENDING PRODUCTS (ADMIN)
router.get("/pending", async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    console.error("GET PENDING PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ APPROVE PRODUCT (ADMIN)
router.put("/approve/:id", async (req, res) => {
  try {
    const { marketPrice } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        marketPrice,
        rejectReason: ""
      },
      { new: true }
    );

    res.status(200).json(product);
  } catch (err) {
    console.error("APPROVE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ REJECT PRODUCT (ADMIN)
router.put("/reject/:id", async (req, res) => {
  try {
    const { reason } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectReason: reason
      },
      { new: true }
    );

    res.status(200).json(product);
  } catch (err) {
    console.error("REJECT PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🗑 DELETE PRODUCT (FARMER / ADMIN)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
