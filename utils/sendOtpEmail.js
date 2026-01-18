import nodemailer from "nodemailer";

const sendOtpEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false   // 🔥 THIS FIX
      }
    });

    await transporter.sendMail({
      from: `"Farmer Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `
    });

    console.log("OTP sent to:", to);
  } catch (error) {
    console.error("OTP ERROR:", error);
    throw error;
  }
};

export default sendOtpEmail;
