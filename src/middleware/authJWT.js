import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token  !!😒😒" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu payload vào req để dùng ở route sau
    req.user = decoded;

    next(); // cho phép đi tiếp
  } catch (err) {
    return res.status(403).json({ message: "token hết hạn" });
  }
};

export default authMiddleware;
