import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import db from "../../config/db.js";

import redisClient from "../../config/redis.js";

const verifyOtpMiddleware = async (req, res) => {
  try {
    const user_id = req.user?.user_id; // nếu bạn dùng middleware auth
    const { otp } = req.body;
    if (!user_id || !otp) {
      return res.status(400).json({ message: "Thiếu thông tin xác thực" });
    }
    // Lấy email từ DB
    const [[emaildb]] = await db
      .promise()
      .execute(`SELECT email FROM users WHERE user_id = ?`, [user_id]);

    const email = emaildb?.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy email người dùng" });
    }
    // lấy opt
    const optKey = `otp:${email}`;
    const storedOtpHash = await redisClient.get(optKey);
    console.log("🧠 OTP người nhập:", otp);
    console.log("📧 Email:", email);
    console.log("🔑 Redis key:", optKey);
    console.log("💾 storedOtpHash:", storedOtpHash);

    if (!storedOtpHash) {
      return res
        .status(400)
        .json({ message: "Mã OTP đã hết hạn hoặc không tồn tại" });
    }
    const isOtpValid = await bcrypt.compare(otp.toString(), storedOtpHash);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }
    // ✅ Xác thực thành công
    await redisClient.del(optKey); // xoá OTP sau khi xác thực
    return res
      .status(200)
      .json({ ok: true, message: "Xác thực OTP thành công!" });
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export default verifyOtpMiddleware;
