// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

import chatbotRoutes from "./routes/chatbot.js";
import userRoutes from "./routes/users.js";
import weatherRoutes from "./routes/weather.js";
import geminiRoutes from "./routes/gemini.js";

dotenv.config();

const app = express();

/* 🔥🔥🔥 CORS MUST COME FIRST 🔥🔥🔥 */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* 🔥 PRE-FLIGHT FIX */
app.options("*", cors());

/* Middleware */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* Routes */
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* Root route */
app.get("/", (req, res) => {
  res.send("Farmer Shop Backend is running!");
});

/* MongoDB */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});
