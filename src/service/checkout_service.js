import db from "../config/db.js";
import create_id from "./utils/id.js";

const tong_tien = (list_gia_ban, giam_gia_tong_hd) => {
  let tong = 0;
  for (let i = 0; i < list_gia_ban.length; i++) {
    tong += list_gia_ban[i][0].gia_ban; //  lấy phần tử đầu tiên trong mảng con
  }
  const giamGia = 1 - giam_gia_tong_hd / 100;

  return (tong = tong * giamGia);
};
const new_checkout_service = async (
  khachhang_id,
  hinh_thuc_thanh_toan,
  giam_gia_tong_hd,
  ghi_chu,
  list_sanpham
) => {
  const hoadon_id = create_id("HD_"); // tạo id hóa đơn
  const connection = db.promise();

  try {
    await connection.beginTransaction();
    let list_gia_ban = [];
    // Lấy thông tin sản phẩm từ DB
    for (let i = 0; i < list_sanpham[0].sanpham.length; i++) {
      const rows = await connection.execute(
        `SELECT gia_ban 
     FROM sanpham 
     WHERE sanpham_id = ?`,
        [list_sanpham[0].sanpham[i].sanpham_id]
      );
      if (rows.length === 0) throw new Error("Sản phẩm không tồn tại");
      list_gia_ban.push(rows[0]);
    }
    console.log("sản phẩm với giá bán", list_gia_ban);
    //// có hàm xử lý giá bán theo %
    const tong_tien_HD = tong_tien(list_gia_ban, giam_gia_tong_hd);
    console.log(">>>> tổng tiền là", tong_tien_HD);

    await connection.execute(
      `INSERT INTO hoadon 
        (hoadon_id, khachhang_id, shop_id, ngay_lap, tong_tien, hinh_thuc_thanh_toan, trang_thai, giam_gia_tong_hd, ghi_chu) 
       VALUES (?, ?, ?, now(), ?, ?, ?, ?, ?)`,
      [
        hoadon_id,
        khachhang_id,
        list_sanpham[0].shop_id,
        tong_tien_HD,
        hinh_thuc_thanh_toan,
        "Chờ xử lý", // trạng thái mặc định
        giam_gia_tong_hd,
        ghi_chu || "",
      ]
    );

    // 4. Insert chi tiết hóa đơn + cập nhật kho
    for (let sp of list_sanpham[0].sanpham) {
      let i = 0;
      const cthd_id = create_id("CTHD_");
      const soLuong = parseInt(sp.so_luong, 10);
      const thanhTien =
        soLuong *
        list_gia_ban[i].gia_ban
      // insert chi tiết hóa đơn
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
         WHERE sanpham_id = ? `,
        [soLuong, sp.sanpham_id]
      );
    }

    await connection.commit();
    console.log("✅ Thanh toán thành công");

    return { hoadon_id, tong_tien };
  } catch (error) {
    await connection.rollback();
    console.error("❌ Rollback do lỗi:", error.message);
    throw error;
  }
};

const checkout_service = { new_checkout_service };
export default checkout_service;
