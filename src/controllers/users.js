import user_Service from "../service/user_Service.js";

import check from "../service/utils/checkUsers.js";

import db from "../config/db.js";
const createUserController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      user_name,
      password,
      date_of_birth,
    } = req.body;

    // ✅ Bẫy lỗi nếu thiếu dữ liệu bắt buộc
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message:
          "Thiếu dữ liệu bắt buộc: firt_name, last_name, email, password",
      });
    }
    const checkMail = await check.checkEmailExist(email);
    if (checkMail) {
      return res.status(400).json({
        status: "fail",
        message: "Email bị trùng",
      });
    }

    const checkPhone = await check.checkPhoneExist(phone);
    if (checkPhone) {
      return res.status(400).json({
        status: "fail",
        message: "Phone bị trùng",
      });
    }
    const checkUser_name = await check.checkUser_name(user_name);
    if (checkUser_name) {
      return res.status(400).json({
        status: "fail",
        message: "User_name bị trùng",
      });
    }
    const newUser = await user_Service.createUserService(
      first_name,
      last_name,
      email,
      phone,
      user_name,
      password,
      date_of_birth
    );
    res.status(200).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
// login co jwt
const User_Login = async (req, res) => {
  const { user_name, password } = req.body;
  console.log("data nhận đc", req.body);
  if (!user_name || !password)
    return res
      .status(400)
      .json({ status: "fail", message: "vui lòng nhập đầy đủ thông tin" });

  const login_User_Service = await user_Service.login_User_Service(
    user_name,
    password
  );
  if (!login_User_Service.status) {
    return res.status(400).json({
      staus: "fail",
      message: "mật khẩu hoặc password bị sai",
    });
  } else {
    res.cookie("access_Token", login_User_Service.access_Token, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    // Gửi refreshToken vào cookie
    res.cookie("refreshToken", login_User_Service.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.status(200).json({
      status: "succes",
      data: login_User_Service,
    });
  }
};

// get alll user phải có quyền hann
// controller/userController.js
const getAll_User = async (req, res) => {
  try {
    // kiểm tra quyền
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    // query database
    const [rows] = await db.promise().query(`SELECT * FROM users`);

    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const userController = { createUserController, User_Login, getAll_User };
export default userController;
