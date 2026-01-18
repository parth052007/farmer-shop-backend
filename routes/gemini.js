import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Prompt missing" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.log("❌ GEMINI_API_KEY missing");
      return res.status(500).json({ reply: "API key missing" });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply: text });
  } catch (error) {
    console.error("🔥 Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "AI service unavailable" });
  }
});

export default router;
