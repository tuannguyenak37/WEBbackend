import db from "../config/db.js";
import create_id from "./utils/id.js";

const addSan_Pham_Srvice = async (
  user_id,
  ten_sanpham,
  gia_ban,
  mo_ta,
  kho_id,
  so_luong_ton,
  url_sanpham 
) => {
  const chuoiSP = "SP_";
  const SP_id = create_id(chuoiSP);
  
  try {
    await db.promise().beginTransaction();

    // 1. Thêm sản phẩm
    await db.promise().query(
      `INSERT INTO sanpham (sanpham_id, ten_sanpham, gia_ban, mo_ta, user_id,url_sanpham) 
       VALUES (?, ?, ?, ?, ?,?)`,
      [SP_id, ten_sanpham, gia_ban, mo_ta, user_id, url_sanpham]
    );

    // 2. Thêm bản ghi vào kho_sanpham
    const chuoiSPkho = "SPkho_";
    const kho_sanpham_id = create_id(chuoiSPkho);
    await db.promise().query(
      `INSERT INTO kho_sanpham (kho_sanpham_id, sanpham_id,kho_id, so_luong_ton, ngay_nhap) 
       VALUES (?, ?,?, ?, NOW())`,
      [kho_sanpham_id, SP_id, kho_id, so_luong_ton]
    );

    await db.promise().commit();

    return { success: true, sanpham_id: SP_id };
  } catch (err) {
    await db.promise().rollback();
    throw err;
  }
};

const sanPham_Service = { addSan_Pham_Srvice };
export default sanPham_Service;
