import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import bcrypt from "bcryptjs";
import db from "../../config/db.js";
import nodemailer from "nodemailer";
import redisClient from "../../config/redis.js";

const OTP_EXPIRE = parseInt(process.env.OTP_EXPIRE_SECONDS || "300"); // 5 phút

// ⚙️ Khởi tạo transporter Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true nếu dùng cổng 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔢 Hàm tạo OTP ngẫu nhiên 6 chữ số
function generateOtp(length = 6) {
  return crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
}

// 📩 Middleware gửi OTP qua email
const sendOtpMiddleware = async (req, res) => {
  try {
    const user_id = req.user?.user_id; // tránh lỗi nếu req.user không có
    if (!user_id) {
      return res.status(400).json({ message: "Thiếu user_id trong request" });
    }

    const [[emaildb]] = await db
      .promise()
      .execute(`SELECT email FROM users WHERE user_id = ?`, [user_id]);

    const email = emaildb?.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy email của người dùng" });
    }

    const otp = generateOtp(6);
    const otpHash = await bcrypt.hash(otp, 10);

    // 🔒 Lưu OTP vào Redis với key: otp:<email>
    await redisClient.setEx(`otp:${email}`, OTP_EXPIRE, otpHash);

    // ✉️ Gửi email
    await transporter.sendMail({
      from: `"Hệ thống xác thực" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Mã OTP xác nhận của bạn",
      html: `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f5f6fa; padding: 40px 0;">
    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
      <div style="background: linear-gradient(135deg, #007BFF, #00C6FF); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 20px;">Xác thực MALIKETH</h2>
      </div>
      <div style="padding: 30px; text-align: center;">
        <p style="font-size: 15px; color: #333;">Xin chào,</p>
        <p style="font-size: 15px; color: #333;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p style="font-size: 15px; color: #333;">Mã OTP để xác thực của bạn là:</p>
        <div style="font-size: 30px; font-weight: bold; color: #007BFF; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #555;">Mã này có hiệu lực trong <strong>${
          OTP_EXPIRE / 60
        } phút</strong>.</p>
        <p style="font-size: 13px; color: #999;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
      </div>
      <div style="background-color: #f1f2f6; padding: 10px 0; text-align: center; color: #888; font-size: 12px;">
        © ${new Date().getFullYear()} Hệ thống xác thực. Mọi quyền được bảo lưu.
      </div>
    </div>
  </div>
  `,
    });

    console.log(`✅ OTP gửi tới ${email}: ${otp}`); // chỉ dùng khi debug

    // Tiếp tục đến handler tiếp theo
    return res
      .status(200)
      .json({ ok: true, message: "OTP đã được gửi qua email!" });
  } catch (err) {
    console.error("❌ Lỗi gửi OTP:", err);
    return res.status(500).json({ ok: false, message: "Gửi OTP thất bại" });
  }
};

export default sendOtpMiddleware;
