import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  const token = req.cookies.access_Token;

  if (!token) {
    return res.status(401).json({ message: "No token !!😒😒" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      // Token hợp lệ
      req.user = decoded;
      return next();
    }

    // Nếu token hết hạn, kiểm tra refresh token trong cookie
    if (err.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(401).json({ message: "No refresh token" });

      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Refresh token không hợp lệ" });

        // Tạo access token mới
        const newAccessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            shop_id: user.shop_id || null,
          },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        // Gửi token mới qua header để frontend lưu
        res.setHeader("x-access-token", newAccessToken);
        res.cookie("access_Token", newAccessToken, {
          httpOnly: false,
          secure: false,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        // Lưu thông tin user vào req
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
  });
};

export default authMiddleware;
