require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.PASSWORD, // Your email password or app password
  },
});

// API to handle booking
app.post("/api/book", (req, res) => {
  const { name, email, phone, date, time, message } = req.body;

  const userMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "🌿 Your Booking is Confirmed – Tripod Wellness",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50; text-align: center;">Booking Confirmation</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We’re delighted to confirm your booking with <strong>Tripod Wellness</strong>. Here are the details of your appointment:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>⏰ Time:</strong> ${time}</p>
          <p><strong>📝 Message:</strong> ${message || "N/A"}</p>
        </div>
        <p>We look forward to welcoming you. If you have any questions or need to reschedule, feel free to reach out.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Tripod Wellness Team</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #777;">For inquiries, contact us at <a href="wellnesstripod@gmail.com">wellnesstripod@gmail.com</a></p>
      </div>
    `,
  };
  

  const adminMailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "📩 New Booking Received – Tripod Wellness",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50; text-align: center;">New Booking Alert</h2>
        <p><strong>A new booking has been received.</strong> Here are the details:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📞 Phone:</strong> ${phone}</p>
          <p><strong>📅 Date:</strong> ${date}</p>
          <p><strong>⏰ Time:</strong> ${time}</p>
          <p><strong>📝 Message:</strong> ${message || "N/A"}</p>
        </div>
        <p style="margin-top: 20px;">Please review and take any necessary actions.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Tripod Wellness System</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  };
  

  // Send emails
  transporter.sendMail(userMailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error sending email to user" });
    }

    transporter.sendMail(adminMailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error sending email to admin" });
      }

      res.status(200).json({ message: "Booking successful, emails sent!" });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
