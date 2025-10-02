import db from "../../config/db.js";
import dotenv from "dotenv";
dotenv.config;
const xemSP_client_controller = async (req, res) => {
  try {
    const [rows] = await db.promise().execute(`
  SELECT 
    sanpham_id,
    ten_sanpham,
    gia_ban,
    mo_ta,
    CONCAT('http://localhost:${process.env.port}', url_sanpham) AS url_sanpham
  FROM sanpham
  LIMIT 4
`);

    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("❌ Error in xemSP_client_controller:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const xemCTSP_client_controller = async (req, res) => {
  const { sanpham_id } = req.params;
  console.log(">>>", sanpham_id);
  try {
    const [rows] = await db.promise().execute(
      `SELECT 
    sp.sanpham_id,
    sp.ten_sanpham,
    sp.gia_ban,
    sp.mo_ta AS mo_ta_sanpham,
    sp.url_sanpham,
    sp.loai_sanpham,
    s.shop_id,
    s.user_id,
    s.ten_shop,
    s.mo_ta AS mo_ta_shop,
    s.the_loai,
    s.ngay_tao,
    COALESCE(SUM(ks.so_luong_ton), 0) AS tong_so_luong_ton
FROM sanpham sp
LEFT JOIN kho_sanpham ks ON sp.sanpham_id = ks.sanpham_id
LEFT JOIN kho k ON ks.kho_id = k.kho_id
LEFT JOIN shop s ON k.shop_id = s.shop_id
WHERE sp.sanpham_id = ?
GROUP BY 
    sp.sanpham_id,
    sp.ten_sanpham,
    sp.gia_ban,
    sp.mo_ta,
    sp.url_sanpham,
    sp.loai_sanpham,
    s.shop_id,
    s.user_id,
    s.ten_shop,
    s.mo_ta,
    s.the_loai,
    s.ngay_tao`,
      [sanpham_id] // 👈 tham số phải để ngoài string
    );
    rows[0].url_sanpham =
      `http://localhost:${process.env.port}` + rows[0].url_sanpham;

    return res.status(200).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ ko xem đc ct sp:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const SP_client_controller = {
  xemSP_client_controller,
  xemCTSP_client_controller,
};
export default SP_client_controller;
