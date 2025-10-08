import db from "../../config/db.js"; // lấy object db trực tiếp

const check_SP = async (sanpham_id, shop_id) => {
  try {
    const [rows] = await db
      .promise()
      .query(`select * from sanpham where sanpham_id =? and shop_id =?`, [
        sanpham_id,
        shop_id,
      ]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};
const check_kho = async (kho_id) => {
  try {
    const [rows] = await db
      .promise()
      .query(` select * from kho where kho_id =?`, [kho_id]);
    return rows.length > 0;
  } catch (error) {
    throw err;
  }
};

// kiểm tra sản phẩm còn tồn kho hay ko
const check_ton_kho = async (list_sanpham) => {
  try {
    for (let sp of list_sanpham) {
      const sanpham_id = sp.sanpham_id;

      const [rows] = await db
        .promise()
        .execute(`SELECT * FROM kho_sanpham WHERE sanpham_id = ?`, [
          sanpham_id,
        ]);

      if (!rows || rows.length === 0) {
        throw new Error(`Sản phẩm ${sanpham_id} không tồn tại`);
      }

      if (rows[0].so_luong_ton <= 0) {
        throw new Error(`Sản phẩm ${sanpham_id} đã hết hàng`);
      }
    }

    return true; // tất cả sản phẩm còn hàng
  } catch (error) {
    console.error("❌ Lỗi kiểm tra tồn kho:", error.message);
    throw error;
  }
};

const khoCheck = { check_SP, check_kho, check_ton_kho };
export default khoCheck;
