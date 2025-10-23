import db from "../config/db.js";
import sanPham_Service from "../service/sanPham_Service.js";
import check from "../service/utils/KhoCheck.js";
import dotenv from "dotenv";
dotenv.config();
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
    if (!ten_sanpham || !gia_ban || !mo_ta || !loai_sanpham || !nha_cung_cap) {
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
  const shop_id = req.user.shop_id;

  console.log("...", sanpham_id, req.user);

  if (!sanpham_id)
    return res.status(401).json({
      status: "fail",
      message: " thiếu id sản phẩm",
    });
  const is_sp = await check.check_SP(sanpham_id, shop_id);
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
      .query("DELETE FROM sanpham WHERE sanpham_id = ? AND shop_id = ?", [
        sanpham_id,
        shop_id,
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
const base_url = process.env.URL_IMAGE || "";

// 📦 Xem danh sách sản phẩm theo shop đang đăng nhập
const xem_SanPham_Controller = async (req, res) => {
  try {
    const shop_id = req.user?.shop_id; // shop_id lấy từ token người dùng
    if (!shop_id) {
      return res.status(400).json({
        status: "fail",
        message: "Không xác định được shop_id của người dùng",
      });
    }

    const sql = `
      SELECT 
        s.sanpham_id,
        s.ten_sanpham,
        s.gia_ban,
        s.mo_ta,
        CONCAT(?, s.url_sanpham) AS url_sanpham,
        s.loai_sanpham,
        s.giam_gia_SP,
        s.shop_id,
        sh.ten_shop,
        sh.dia_chi_shop,
        CONCAT(?, sh.url_shop) AS url_shop
      FROM sanpham AS s
      JOIN shop AS sh ON s.shop_id = sh.shop_id
      WHERE s.shop_id = ?
      ORDER BY s.sanpham_id DESC;
    `;

    const [rows] = await db
      .promise()
      .execute(sql, [base_url, base_url, shop_id]);

    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Lỗi database:", error);
    return res.status(500).json({
      status: "error",
      message: "Không thể lấy danh sách sản phẩm của shop",
    });
  }
};

const sua_SanPham_Controller = async (req, res) => {
  const { sanpham_id } = req.params;
  const shop_id = req.user.shop_id;

  const { ten_sanpham ="", gia_ban ="", mo_ta ="", loai_sanpham ="", giam_gia_SP="" } = req.body;

  const url_sanpham = req.file ? `/${req.file.filename}` : undefined;

  try {
    // Kiểm tra sản phẩm tồn tại
    const [exist] = await db
      .promise()
      .query(`SELECT * FROM sanpham WHERE sanpham_id = ? AND shop_id = ?`, [
        sanpham_id,
        shop_id,
      ]);

    if (exist.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Sản phẩm không tồn tại hoặc không thuộc cửa hàng này",
      });
    }

    const current = exist[0];

    // ✅ Chỉ cập nhật nếu giá trị hợp lệ, tránh lỗi kiểu dữ liệu
    const updatedData = {
      ten_sanpham:
        ten_sanpham && ten_sanpham.trim() !== ""
          ? ten_sanpham
          : current.ten_sanpham,
      gia_ban:
        gia_ban !== undefined && gia_ban !== null && gia_ban !== ""
          ? Number(gia_ban)
          : current.gia_ban,
      mo_ta: mo_ta && mo_ta.trim() !== "" ? mo_ta : current.mo_ta,
      url_sanpham:
        url_sanpham && url_sanpham.trim() !== ""
          ? url_sanpham
          : current.url_sanpham,
      loai_sanpham:
        loai_sanpham && loai_sanpham.trim() !== ""
          ? loai_sanpham
          : current.loai_sanpham,
      giam_gia_SP:
        giam_gia_SP !== undefined && giam_gia_SP !== null && giam_gia_SP !== ""
          ? Number(giam_gia_SP)
          : current.giam_gia_SP,
    };

    // Cập nhật sản phẩm
    const [result] = await db.promise().query(
      `
      UPDATE sanpham 
      SET 
        ten_sanpham = ?, 
        gia_ban = ?, 
        mo_ta = ?, 
        url_sanpham = ?, 
        loai_sanpham = ?, 
        giam_gia_SP = ?
      WHERE sanpham_id = ? AND shop_id = ?
      `,
      [
        updatedData.ten_sanpham,
        updatedData.gia_ban,
        updatedData.mo_ta,
        updatedData.url_sanpham,
        updatedData.loai_sanpham,
        updatedData.giam_gia_SP,
        sanpham_id,
        shop_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Không thể cập nhật sản phẩm",
      });
    }

    // Lấy lại dữ liệu mới nhất
    const [updated] = await db.promise().query(
      `
      SELECT sanpham_id, ten_sanpham, gia_ban, mo_ta, 
        CONCAT(?, url_sanpham) AS url_sanpham, 
        loai_sanpham, giam_gia_SP, shop_id
      FROM sanpham WHERE sanpham_id = ?
      `,
      [base_url, sanpham_id]
    );

    return res.status(200).json({
      status: "success",
      message: "Cập nhật sản phẩm thành công",
      data: updated[0],
    });
  } catch (error) {
    console.error("❌ Lỗi khi sửa sản phẩm:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server khi sửa sản phẩm",
    });
  }
};

// Xuất
const sanPham_controllers = {
  addSan_PhamController,
  delete_San_PhamController,
  xem_SanPham_Controller,
  sua_SanPham_Controller,
};
export default sanPham_controllers;
