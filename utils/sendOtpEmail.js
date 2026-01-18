import axios from "axios";

const sendOtpEmail = async (to, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "Farmer Shop"
        },
        to: [{ email: to }],
        subject: "Your OTP Code",
        htmlContent: `<h1>Your OTP is ${otp}</h1>`
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        }
      }
    );

    console.log("✅ OTP sent via Brevo API");
  } catch (err) {
    console.error("❌ BREVO API ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export default sendOtpEmail;
