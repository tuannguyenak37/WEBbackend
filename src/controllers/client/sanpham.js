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
    user_id,
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

const SP_client_controller = { xemSP_client_controller };
export default SP_client_controller;
