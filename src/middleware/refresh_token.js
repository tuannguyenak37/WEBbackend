import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Route refresh token
router.post("/refresh-token", (req, res) => {
  // Lấy refresh token từ cookie
  const refreshToken = req.cookies.refreshToken;
  console.log(">>>", refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  // Kiểm tra refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Refresh token không hợp lệ" });

    // Tạo access token mới
    const payload = {
      User_id: user.user_id,
      user_name: user.user_name,
      role: user.role,
      last_name: user.last_name,
      shop_id: user.shop_id || null,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken, user });
  });
});

export default router;
