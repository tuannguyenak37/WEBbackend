import db from "../../config/db.js"; // lấy object db trực tiếp

const check_SP = async (sanpham_id, user_id) => {
  try {
    const [rows] = await db
      .promise()
      .query(`select * from sanpham where sanpham_id =? and user_id =?`, [
        sanpham_id,
        user_id,
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

const khoCheck = { check_SP, check_kho };
export default khoCheck;
