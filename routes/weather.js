import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const API_KEY = process.env.WEATHER_API_KEY;

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`;

    const response = await axios.get(url);
    const data = response.data;

    const temp = data.current.temp_c;
    const rain = data.forecast.forecastday[0].day.daily_chance_of_rain;

    let alert = "Weather normal – farming safe";

    if (rain > 50)
      alert = "🌧️ Kal barish hogi → irrigation mat karo";
    else if (temp > 38)
      alert = "🔥 Heatwave → crop cover karo";

    res.json({ temp, rain, alert });
  } catch (err) {
    res.status(500).json({ message: "Weather fetch failed" });
  }
});

export default router;
