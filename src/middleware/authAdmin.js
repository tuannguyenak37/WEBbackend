const authAdmin = (req, res, next) => {
  const role = req.user?.role;

  if (role === "admin") {
    return next(); // cho phép đi tiếp
  }

  return res.status(403).json({
    message: "Chỉ có admin mới được phép",
  });
};

export default authAdmin;
