import db from "../config/db.js";
import create_id from "./utils/id.js";

const addKho_service = async (ten_kho, dia_chi, nha_cung_cap, user_id) => {
  const chuoi = "KHO_";
  const kho_id = create_id(chuoi);

  try {
    await db
      .promise()
      .query(
        `INSERT INTO kho (kho_id, ten_kho, dia_chi, nha_cung_cap,user_id) VALUES (?,?,?,?,?)`,
        [kho_id, ten_kho, dia_chi, nha_cung_cap, user_id]
      );

    return kho_id;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm vào kho (bảng trung gian)
const addSanphamToKho_service = async (kho_id, sanpham_id, so_luong_ton) => {
  try {
    await db
      .promise()
      .query(
        `INSERT INTO kho_sanpham (kho_id, sanpham_id, so_luong_ton, ngay_nhap) VALUES (?,?,?,CURDATE())`,
        [kho_id, sanpham_id, so_luong_ton]
      );
  } catch (error) {
    throw error;
  }
};

// Cập nhật số lượng hoặc nhà cung cấp trong bảng kho
const SuaKho_service = async (kho_id, ten_kho, dia_chi, nha_cung_cap) => {
  try {
    await db
      .promise()
      .query(
        `UPDATE kho SET ten_kho=?, dia_chi=?, nha_cung_cap=? WHERE kho_id=?`,
        [ten_kho, dia_chi, nha_cung_cap, kho_id]
      );
  } catch (error) {
    throw error;
  }
};

// Cập nhật số lượng sản phẩm trong kho (bảng trung gian)
const SuaSanphamTrongKho_service = async (kho_id, sanpham_id, so_luong_ton) => {
  try {
    await db
      .promise()
      .query(
        `UPDATE kho_sanpham SET so_luong_ton=? WHERE kho_id=? AND sanpham_id=?`,
        [so_luong_ton, kho_id, sanpham_id]
      );
  } catch (error) {
    throw error;
  }
};
const nhap_kho_service = async (listSanPham, kho_id) => {
  const connection = db.promise(); // dùng trực tiếp connection hiện tại
  try {
    await connection.beginTransaction();

    if (!Array.isArray(listSanPham)) {
      throw new Error("listSanPham phải là array");
    }

    const caseStr = listSanPham
      .map((sp) => `WHEN '${sp.sanpham_id}' THEN ${parseInt(sp.so_luong, 10)}`)
      .join(" ");

    const ids = listSanPham.map((sp) => `'${sp.sanpham_id}'`).join(",");

    const sql = `
      UPDATE kho_sanpham
      SET so_luong_ton = so_luong_ton + CASE sanpham_id ${caseStr} END
      WHERE kho_id = ? AND sanpham_id IN (${ids})
    `;

    console.log("SQL query:", sql);

    await connection.execute(sql, [kho_id]);

    await connection.commit();
    console.log("✅ Transaction thành công");
  } catch (error) {
    await connection.rollback();
    console.error("❌ Rollback do lỗi:", error.message);
    throw error;
  }
};

const Kho_service = {
  addKho_service,
  addSanphamToKho_service,
  SuaKho_service,
  SuaSanphamTrongKho_service,
  nhap_kho_service,
};

export default Kho_service;
