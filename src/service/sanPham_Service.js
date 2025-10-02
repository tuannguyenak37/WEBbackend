import db from "../config/db.js";
import create_id from "./utils/id.js";

const addSan_Pham_Srvice = async (
  ten_sanpham,
  gia_ban,
  mo_ta,
  kho_id,
  so_luong_ton,
  url_sanpham,
  loai_sanpham,
  shop_id,
  nha_cung_cap
) => {
  const SP_id = create_id("SP_");
  const kho_sanpham_id = create_id("SPkho_");

  try {
    // 1️⃣ Thêm sản phẩm
    await db.promise().query(
      `INSERT INTO sanpham 
       (sanpham_id, ten_sanpham, gia_ban, mo_ta, url_sanpham, loai_sanpham, shop_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [SP_id, ten_sanpham, gia_ban, mo_ta, url_sanpham, loai_sanpham, shop_id]
    );

    // 2️⃣ Thêm vào kho_sanpham
    await db.promise().query(
      `INSERT INTO kho_sanpham 
       (kho_sanpham_id, sanpham_id, kho_id, so_luong_ton, ngay_nhap, nha_cung_cap) 
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [kho_sanpham_id, SP_id, kho_id, so_luong_ton, nha_cung_cap]
    );

    return { success: true, sanpham_id: SP_id };
  } catch (err) {
    console.error("❌ Lỗi addSan_Pham_Srvice:", err);
    throw err; // controller sẽ catch lỗi
  }
};

const sanPham_Service = { addSan_Pham_Srvice };
export default sanPham_Service;
