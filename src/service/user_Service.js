import db from "../config/db.js"; // lấy object db trực tiếp
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// Cấu hình mã hóa mật khẩu
const saltRounds = 10;

// ===================== CREATE USER =====================
const createUserService = async (
  first_name,
  last_name,
  email,
  phone,
  user_name,
  password,
  date_of_birth
) => {
  try {
    // 1️⃣ Lấy user_id lớn nhất
    const [rows] = await db
      .promise()
      .query(`SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1`);

    let newId = "id1";
    if (rows.length > 0) {
      const lastIdNum = parseInt(rows[0].user_id.replace("id", "")) || 0;
      newId = "id" + (lastIdNum + 1);
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const role = "user";

    await db.promise().query(
      `INSERT INTO users 
  (user_id, first_name, last_name, email, phone, user_name, password, role, date_of_birth, status, last_login, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NOW(), NOW())`,
      [
        newId,
        first_name,
        last_name,
        email,
        phone,
        user_name,
        hashPassword,
        role,
        date_of_birth,
        "active",
      ]
    );

    return {
      user_id: newId,
      first_name,
      last_name,
      email,
      phone,
      user_name,
      role,
      date_of_birth,
    };
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
};

// ===================== LOGIN USER =====================
const login_User_Service = async (user_name, password) => {
  try {
    // 1️⃣ Lấy user theo username
    const [rows] = await db.promise().query(
      `SELECT user_id, first_name, last_name, email, phone, user_name, password, role, avatar_url, date_of_birth 
       FROM users 
       WHERE user_name = ?`,
      [user_name]
    );

    if (rows.length === 0) {
      return { status: false, message: "❌ User không tồn tại" };
    }

    const foundUser = rows[0]; // dùng biến riêng, không trùng tên

    // 2️⃣ So sánh mật khẩu nhập với hash trong DB
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return { status: false, message: "❌ Mật khẩu không chính xác" };
    }

    // 3️⃣ Trả về thông tin user (ẩn password)
    delete foundUser.password;
    // 1️⃣ Lấy shop từ DB
    const [shopRows] = await db
      .promise()
      .query(`SELECT shop_id, ten_shop FROM shop WHERE user_id = ?`, [
        foundUser.user_id,
      ]);
    // Nếu có shop thì thêm vào user
    if (shopRows.length > 0) {
      foundUser.shop_id = shopRows[0].shop_id;
      foundUser.ten_shop = shopRows[0].ten_shop;
    } else {
      foundUser.shop_id = null;
    }

    // 2️⃣ Xử lý shop (lấy 1 shop nếu có, null nếu chưa có)
    const shop = shopRows.length > 0 ? shopRows[0] : null;

    // 3️⃣ Debug
    console.log("shop", shop);

    // 4️⃣ Tạo payload JWT
    const payload = {
      user_id: foundUser.user_id,
      role: foundUser.role,
      user_name: foundUser.user_name,
      last_name: foundUser.last_name,
      shop_id: shop ? shop.shop_id : null, // null nếu chưa có shop
    };

    // 5️⃣ Tạo access token
    const access_Token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Refresh Token dài hạn
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TIME,
    });

    return {
      status: true,
      message: "✅ Đăng nhập thành công",
      user: foundUser,
      access_Token,
      refreshToken,
    };
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
};

// ===================== EXPORT =====================
const user_Service_A = { createUserService, login_User_Service };
export default user_Service_A;
