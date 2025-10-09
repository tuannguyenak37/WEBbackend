import jwt from "jsonwebtoken";

// Middleware auth hoàn chỉnh
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.access_Token;

    if (!token) {
      return res.status(401).json({ message: "No access token 😒" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        // Token hợp lệ
        req.user = decoded;
        return next();
      }

      // Token hết hạn
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies?.refreshToken;
        console.log(">>>> token reset cũ", refreshToken);
        if (!refreshToken) {
          return res.status(401).json({ message: "No refresh token 😒" });
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return res
              .status(403)
              .json({ message: "Refresh token không hợp lệ" });
          }

          // Tạo access token mới
          const newAccessToken = jwt.sign(
            {
              id: user.id,
              username: user.username,
              role: user.role,
              shop_id: user.shop_id || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
          );

          res.cookie("access_Token", newAccessToken, {
            httpOnly: true, // nên true để bảo mật
            secure: false, // set true nếu dùng https
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });
          console.log(">>token cũ", token);
          console.log("token cấp mới", newAccessToken);
          req.user = user;
          next(); // tiếp tục sang controller
        });
      } else {
        return res.status(403).json({ message: "Token không hợp lệ" });
      }
    });
  } catch (error) {
    console.error("❌ Lỗi authMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
