import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies?.access_Token;
    const refreshToken = req.cookies?.refreshToken;

    // ✅ Nếu không có accessToken, nhưng có refreshToken -> cấp mới
    if (!accessToken && refreshToken) {
      return refreshAccessToken(refreshToken, req, res, next);
    }

    if (!accessToken) {
      return res.status(401).json({ message: "No access token 😒" });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return next();
      }

      // ✅ Access token hết hạn → thử refresh
      if (err.name === "TokenExpiredError" && refreshToken) {
        return refreshAccessToken(refreshToken, req, res, next);
      }

      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc hết hạn" });
    });
  } catch (error) {
    console.error("❌ Lỗi authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🔁 Hàm cấp lại access token mới
function refreshAccessToken(refreshToken, req, res, next) {
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Refresh token không hợp lệ hoặc hết hạn" });
    }
    console.log("token resh cũ ", refreshAccessToken);
    // ✅ Tạo access token mới
    const newAccessToken = jwt.sign(
      {
        user_id: user.user_id, // ✅ đúng key
        user_name: user.user_name, // ✅ đúng key
        role: user.role,
        shop_id: user.shop_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // ✅ Gửi lại cookie access token mới
    res.cookie("access_Token", newAccessToken, {
      httpOnly: true,
      secure: false, // đổi true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    console.log("✅ Refresh access token mới:", newAccessToken);

    // ✅ Giải mã token mới ngay tại đây để dùng trong request hiện tại
    jwt.verify(newAccessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("⚠️ Lỗi verify token mới:", err.message);
        return res.status(403).json({ message: "Lỗi xác thực token mới" });
      }

      req.user = decoded; // Gắn thông tin user mới
      console.log(" user tokend đc cấp lại", req.user);
      next(); // ✅ Controller sau đó sẽ có req.user hợp lệ
    });
  });
}

export default authMiddleware;
