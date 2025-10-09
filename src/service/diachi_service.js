import db from "../config/db.js";
import create_id from "./utils/id.js";

const new_diachi_service = async ({
  dia_chi,
  mo_ta_dia_chi,
  khachhang_id,
  province,
  district,
  ward,
}) => {
  const diachi_id = create_id("DC_");

  try {
    const res = await db.promise().execute(
      `INSERT INTO dia_chi_giao_hang
        (diachi_id, khachhang_id, dia_chi, mo_ta_dia_chi, district, province, ward)
        VALUES (?,?,?,?,?,?,?)`,
      [
        diachi_id,
        khachhang_id,
        dia_chi,
        mo_ta_dia_chi,
        district,
        province,
        ward,
      ]
    );

    console.log(">>>> Data địa chỉ :", res);
    return res;
  } catch (error) {
    throw error;
  }
};

const diachi_service = { new_diachi_service };
export default diachi_service;
