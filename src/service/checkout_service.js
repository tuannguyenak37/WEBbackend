import db from "../config/db.js";
import create_id from "./utils/id.js";

const new_checkout_service = async (
  khachhang_id,
  shop_id,
  hinh_thuc_thanh_toan,
  giam_gia_tong_hd,
  ghi_chu,
  list_sanpham
) => {
  console.log("ENTER new_checkout_service:", {
    khachhang_id,
    shop_id,
    hinh_thuc_thanh_toan,
    giam_gia_tong_hd,
    ghi_chu,
    list_sanpham,
    list_sanphamType: Array.isArray(list_sanpham)
      ? "array"
      : typeof list_sanpham,
    listLen: Array.isArray(list_sanpham) ? list_sanpham.length : null,
  });
  const hoadon_id = create_id("HD_"); // tạo id hóa đơn
  const connection = db.promise();

  try {
    await connection.beginTransaction();

    if (!Array.isArray(list_sanpham) || list_sanpham.length === 0) {
      throw new Error("list_sanpham phải là mảng và có ít nhất 1 sản phẩm");
    }

    // 2. Tính tổng tiền

    // Lấy thông tin sản phẩm từ DB
    const [rows] = await connection.execute(
      `SELECT gia_ban 
     FROM sanpham 
     WHERE sanpham_id = ?`,
      [list_sanpham.sanpham_id]
    );

    if (rows.length === 0) throw new Error("Sản phẩm không tồn tại");

    const { gia_ban } = rows[0];

    const thanhTien = soLuong * parseFloat(gia_ban);

    tong_tien += thanhTien;
    console.log(">>>>> tỏng tien", tong_tien);

    // 3. Insert hóa đơn
    const ngay_lap = new Date();
    await connection.execute(
      `INSERT INTO hoadon 
        (hoadon_id, khachhang_id, shop_id, ngay_lap, tong_tien, hinh_thuc_thanh_toan, trang_thai, giam_gia_tong_hd, ghi_chu) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hoadon_id,
        khachhang_id,
        shop_id,
        ngay_lap,
        tong_tien,
        hinh_thuc_thanh_toan,
        "Chờ xử lý", // trạng thái mặc định
        giam_gia_tong_hd || 0,
        ghi_chu || "",
      ]
    );

    // 4. Insert chi tiết hóa đơn + cập nhật kho
    for (let sp of list_sanpham) {
      const cthd_id = create_id("CTHD_");
      const soLuong = parseInt(sp.so_luong, 10);
      const thanhTien =
        soLuong *
        parseFloat(sp.don_gia) *
        (1 - (sp.giam_gia_percent || 0) / 100);

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
