import khoCheck from "../service/utils/KhoCheck.js";
import Kho_Service from "../service/kho_Service.js";
import db from "../config/db.js";

const addKho_Controller = async (req, res) => {
  const role = req.user.role;
  const { ten_kho, dia_chi } = req.body;
  const shop_id = req.user.shop_id;
  console.log(">>::", shop_id);
  if (!role) {
    return res.status(400).json({
      status: "fail",
      message: "Không tìm thấy quyền người dùng",
    });
  }

  try {
    await Kho_Service.addKho_service(ten_kho, dia_chi, shop_id);
    return res.status(200).json({
      status: "success",
      message: "Thêm kho thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const suaKho = async (req, res) => {
  const { kho_id } = req.params;
  const { so_luong_ton, nha_cung_cap } = req.body;

  try {
    const is_Kho = await khoCheck.check_kho(kho_id); // cần await

    if (!is_Kho) {
      return res.status(400).json({
        status: "fail",
        message: "Kho không tồn tại",
      });
    }

    await Kho_Service.SuaKho_service(kho_id, so_luong_ton, nha_cung_cap);

    return res.status(200).json({
      status: "success",
      message: "Sửa kho thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const xem_kho = async (req, res) => {
  const shop_id = req.user.shop_id;
  try {
    const [rows] = await db.promise().query(
      `SELECT 
    sp.sanpham_id,
    sp.ten_sanpham,
    sp.gia_ban,
    sp.mo_ta,
    ks.so_luong_ton,
    ks.nha_cung_cap,   -- thêm cột nha_cung_cap
    k.ten_kho
FROM sanpham sp
JOIN kho_sanpham ks ON sp.sanpham_id = ks.sanpham_id
JOIN kho k ON ks.kho_id = k.kho_id
WHERE sp.shop_id = ?
`,
      [shop_id]
    );
    console.log(">>", rows);
    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const xem_thongtin_kho_controller = async (req, res) => {
  const shop_id = req.user.shop_id;
  console.log(">>::", shop_id);

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM kho WHERE shop_id = ?", [shop_id]);

    console.log(">>", rows);
    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const nhap_kho_controller = async (req, res) => {
  const { listSanPham, select_kho, nha_cung_cap } = req.body;
  console.log(">>>>>", select_kho);
  const checkK = await khoCheck.check_kho(select_kho);
  if (!checkK)
    return res.status(401).json({
      message: "kho  ko tồn tại",
    });
  console.log(">>>>>", listSanPham);
  try {
    await Kho_Service.nhap_kho_service(listSanPham, select_kho, nha_cung_cap);
    return res.status(200).json({
      status: "success",
      message: "nhập kho thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const Kho_Controllers = {
  addKho_Controller,
  suaKho,
  xem_kho,
  xem_thongtin_kho_controller,
  nhap_kho_controller,
};

export default Kho_Controllers;
