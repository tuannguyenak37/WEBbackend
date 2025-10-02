import db from "../config/db.js";
import sanPham_Service from "../service/sanPham_Service.js";
import check from "../service/utils/KhoCheck.js";
const addSan_PhamController = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    console.log(">>::", shop_id);

    const {
      ten_sanpham,
      gia_ban,
      mo_ta,
      kho_id,
      so_luong_ton,
      loai_sanpham,

      nha_cung_cap,
    } = req.body;

    // Xử lý file upload
    const url_sanpham = req.file ? `/${req.file.filename}` : "";

    // Kiểm tra bắt buộc file ảnh
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Không có file được gửi!",
      });
    }

    // Kiểm tra thông tin bắt buộc
    if (!ten_sanpham || !gia_ban || !mo_ta || !loai_sanpham) {
      return res.status(400).json({
        status: "fail",
        message: "Thêm sản phẩm thất bại, thiếu thông tin",
      });
    }

    // Kiểm tra kho tồn tại
    const is_Kho = await check.check_kho(kho_id);
    if (!is_Kho) {
      return res.status(400).json({
        status: "fail",
        message: "Kho không tồn tại",
      });
    }

    // Gọi service thêm sản phẩm
    const result = await sanPham_Service.addSan_Pham_Srvice(
      ten_sanpham,
      gia_ban,
      mo_ta,
      kho_id,
      so_luong_ton,
      url_sanpham,
      loai_sanpham,
      shop_id,
      nha_cung_cap
    );

    // Trả về kết quả thành công
    return res.status(200).json({
      status: "success",
      message: "Thêm sản phẩm thành công",
      data: result,
    });
  } catch (err) {
    console.error("❌ Lỗi addSan_PhamController:", err);
    return res.status(500).json({
      status: "fail",
      message: "Thêm sản phẩm thất bại, lỗi server",
    });
  }
};

const delete_San_PhamController = async (req, res) => {
  const { sanpham_id } = req.params;
  const user_id = req.user.user_id;

  console.log("...", sanpham_id, req.user);

  if (!sanpham_id)
    return res.status(401).json({
      status: "fail",
      message: " thiếu id sản phẩm",
    });
  const is_sp = await check.check_SP(sanpham_id, user_id);
  if (!is_sp)
    return res.status(401).json({
      status: "fail",
      message: "sản phẩm ko tồn tại",
    });
  try {
    const [res1] = await db
      .promise()
      .query("DELETE FROM kho_sanpham WHERE sanpham_id = ?", [sanpham_id]);
    console.log("Deleted rows in kho_sanpham:", res1.affectedRows);

    const [res2] = await db
      .promise()
      .query("DELETE FROM sanpham WHERE sanpham_id = ? AND user_id = ?", [
        sanpham_id,
        user_id,
      ]);
    console.log("Deleted rows in sanpham:", res2.affectedRows);

    return res.status(200).json({
      status: "success",
      message: `xóa sản phẩm thành công id ${sanpham_id}`,
    });
  } catch (err) {
    console.error("Lỗi database:", err); // log server
    return res.status(500).json({
      status: "error",
      message: "Xóa sản phẩm thất bại",
    });
  }
};

// xem sản phẩm theo người bán
const xem_SanPham_Controller = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const [rows] = await db
      .promise()
      .query(` select * from sanpham where user_id = ?`, [user_id]);

    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Lỗi database:", err); // log server
    return res.status(500).json({
      status: "error",
      message: " thất bại ko thể xem",
    });
  }
};
// Xuất
const sanPham_controllers = {
  addSan_PhamController,
  delete_San_PhamController,
  xem_SanPham_Controller,
};
export default sanPham_controllers;
