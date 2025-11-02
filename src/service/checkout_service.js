import db from "../config/db.js";
import create_id from "./utils/id.js";

const tong_tien = (list_gia_ban, giam_gia_tong_hd) => {
  let tong = 0;
  for (let i = 0; i < list_gia_ban.length; i++) {
    tong += list_gia_ban[i].gia_ban;
  }
  const giamGia = 1 - giam_gia_tong_hd / 100;
  return tong * giamGia;
};

const new_checkout_service = async (
  khachhang_id,
  hinh_thuc_thanh_toan,
  giam_gia_tong_hd,
  ghi_chu,
  { shop_id, sanpham }
) => {
  const hoadon_id = create_id("HD_");
  const connection = await db.promise().getConnection(); // 👈 Lấy connection riêng
  try {
    await connection.beginTransaction();
    let list_gia_ban = [];

    // Lấy giá từng sản phẩm
    for (let i = 0; i < sanpham.length; i++) {
      const [rows] = await connection.execute(
        `SELECT gia_ban FROM sanpham WHERE sanpham_id = ?`,
        [sanpham[i].sanpham_id]
      );
      if (rows.length === 0) throw new Error("Sản phẩm không tồn tại");
      list_gia_ban.push(rows[0]);
    }

    const tong_tien_HD = tong_tien(list_gia_ban, giam_gia_tong_hd);

    // Tạo hóa đơn
    await connection.execute(
      `INSERT INTO hoadon 
        (hoadon_id, khachhang_id, shop_id, ngay_lap, tong_tien, hinh_thuc_thanh_toan, trang_thai, giam_gia_tong_hd, ghi_chu)
       VALUES (?, ?, ?, now(), ?, ?, ?, ?, ?)`,
      [
        hoadon_id,
        khachhang_id,
        shop_id,
        tong_tien_HD,
        hinh_thuc_thanh_toan,
        "Chờ xử lý",
        giam_gia_tong_hd,
        ghi_chu || "",
      ]
    );

    // Chi tiết hóa đơn
    for (let i = 0; i < sanpham.length; i++) {
      const sp = sanpham[i];
      const cthd_id = create_id("CTHD_");
      const soLuong = parseInt(sp.so_luong, 10);
      const thanhTien = soLuong * list_gia_ban[i].gia_ban;

      await connection.execute(
        `INSERT INTO chitiethoadon 
          (cthd_id, hoadon_id, sanpham_id, so_luong, giam_gia_percent, thanh_tien) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          cthd_id,
          hoadon_id,
          sp.sanpham_id,
          soLuong,
          sp.giam_gia_percent || 0,
          thanhTien,
        ]
      );

      await connection.execute(
        `UPDATE kho_sanpham 
         SET so_luong_ton = so_luong_ton - ? 
         WHERE sanpham_id = ?`,
        [soLuong, sp.sanpham_id]
      );
    }

    await connection.commit(); // commit transaction
    connection.release(); // giải phóng connection
    console.log("✅ Thanh toán thành công");
    return { hoadon_id, tong_tien_HD };
  } catch (error) {
    await connection.rollback(); // rollback nếu lỗi
    connection.release();
    console.error("❌ Rollback do lỗi:", error.message);
    throw error;
  }
};

const checkout_service = { new_checkout_service };
export default checkout_service;
