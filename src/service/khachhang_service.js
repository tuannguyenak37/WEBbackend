import db from "../config/db.js";
import create_id from "./utils/id.js";

const new_checkout_service = async (
  khachhang_id,
  hinh_thuc_thanh_toan,
  giam_gia_tong_hd,
  ghi_chu,
  list_sanpham
) => {
  const connection = db.promise();

  try {
    await connection.beginTransaction();

    // // gom sản phẩm theo shop_id
    // const grouped = {};
    // for (let sp of list_sanpham) {
    //   if (!grouped[sp.shop_id])
    //     grouped[sp.shop_id] = [
    //     ];
    //   grouped[sp.shop_id].push(sp);
    // }
    // console.log(">>>", grouped);
    // const result = [];

    // tạo 1 hóa đơn cho từng shop
    for (let shop_id of Object.keys(grouped)) {
      const hoadon_id = create_id("HD_");
      const spList = grouped[shop_id];

      let tong_tien = 0;
      for (let sp of spList) {
        const soLuong = parseInt(sp.so_luong, 10);
        const thanhTien =
          soLuong *
          parseFloat(sp.don_gia) *
          (1 - (sp.giam_gia_percent || 0) / 100);
        tong_tien += thanhTien;
      }
      console.log(">>>>", tong_tien);

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
          "Chờ xử lý",
          giam_gia_tong_hd || 0,
          ghi_chu || "",
        ]
      );

      // insert chi tiết
      for (let sp of spList) {
        const cthd_id = create_id("CTHD_");
        const soLuong = parseInt(sp.so_luong, 10);
        const thanhTien =
          soLuong *
          parseFloat(sp.don_gia) *
          (1 - (sp.giam_gia_percent || 0) / 100);

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
           WHERE sanpham_id = ? AND shop_id = ?`,
          [soLuong, sp.sanpham_id, shop_id]
        );
      }

      result.push({ hoadon_id, shop_id, tong_tien });
    }

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("❌ Rollback do lỗi:", error.message);
    throw error;
  }
};

const checkout_service = { new_checkout_service };
export default checkout_service;
