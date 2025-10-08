import db from "../config/db.js"; // kết nối MySQL (pool hoặc connection)

const new_khachhang_service = async (user_id, ten_khachhang, so_dien_thoai) => {
  try {
    // Tạo mã khách hàng tự động (ví dụ KH + timestamp)
    const khachhang_id = "KH" + Date.now();

    // Thêm khách hàng mới vào bảng
    const [result] = await db.promise().execute(
      "INSERT INTO khachhang (khachhang_id, user_id, ten_khachhang, so_dien_thoai) VALUES (?, ?, ?, ?)",
      [khachhang_id, user_id, ten_khachhang, so_dien_thoai]
    );

    // Trả về thông tin khách hàng mới tạo
    const newCustomer = {
      khachhang_id,
      user_id,
      ten_khachhang,
      so_dien_thoai,
    };

    return newCustomer;
  } catch (error) {
    console.error("❌ Lỗi trong khachhang_service:", error);
    throw error;
  }
};

const khachhang_service = { new_khachhang_service };
export default khachhang_service;
