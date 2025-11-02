import db from "../../config/db.js";
import idtao from "../../service/utils/id.js";
import doenv from "dotenv";
doenv.config();
const baseURL = process.env.URL_IMAGE || "http://localhost:5024";
const newshop = async (req, res) => {
  const user_id = req.user.user_id; // ✅ Lấy từ middleware auth
  const shop_id = idtao("shop");
  const url_shop = req.file ? `/${req.file.filename}` : "";
  const { ten_shop, mo_ta, the_loai } = req.body;

  try {
    // ✅ Kiểm tra user đã có shop chưa
    const [check] = await db
      .promise()
      .query("SELECT * FROM shop WHERE user_id = ?", [user_id]);

    if (check.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Người dùng này đã có shop rồi.",
      });
    }

    // ✅ Tạo shop mới
    await db.promise().query(
      `INSERT INTO shop (shop_id, user_id, ten_shop, mo_ta, the_loai, ngay_tao, url_shop)
         VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [shop_id, user_id, ten_shop, mo_ta, the_loai, url_shop]
    );

    // ✅ Cập nhật role của user
    await db
      .promise()
      .query(`UPDATE users SET role = ? WHERE user_id = ?`, ["admin", user_id]);

    return res.status(200).json({
      status: "success",
      message: "Tạo shop thành công!",
      data: {
        shop_id,
        user_id,
        ten_shop,
        mo_ta,
        the_loai,
        url_shop,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo shop:", error.message);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};


export const pageshop = async (req, res) => {
  const { shop_id } = req.query;

  if (!shop_id) {
    return res.status(400).json({
      status: "fail",
      message: "Thiếu tham số shop_id.",
    });
  }

  try {
    // 🏪 1. Lấy thông tin shop
    const [shop] = await db
      .promise()
      .query("SELECT * FROM shop WHERE shop_id = ?", [shop_id]);

    if (shop.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy shop.",
      });
    }

    const updatedShop = {
      ...shop[0],
      url_shop: shop[0].url_shop
        ? `${baseURL}/${shop[0].url_shop.replace(/^\//, "")}`
        : null,
    };

    // 🛒 2. Lấy danh sách sản phẩm + rating trung bình + tổng lượt bán
    const [products] = await db.promise().query(
      `
      SELECT 
        sp.sanpham_id,
        sp.ten_sanpham,
        sp.gia_ban,
        sp.mo_ta,
        sp.url_sanpham,
        sp.shop_id,
        sp.loai_sanpham,
        sp.giam_gia_SP,
        ROUND(AVG(f.rating), 1) AS rating_trung_binh,
        SUM(ct.so_luong) AS tong_luot_ban
      FROM sanpham sp
      LEFT JOIN feedback f ON sp.sanpham_id = f.sanpham_id
      LEFT JOIN chitiethoadon ct ON sp.sanpham_id = ct.sanpham_id
      WHERE sp.shop_id = ?
      GROUP BY sp.sanpham_id
      `,
      [shop_id]
    );

    // Gắn baseURL cho ảnh sản phẩm
    const updatedProducts = products.map((item) => ({
      ...item,
      url_sanpham: item.url_sanpham
        ? `${baseURL}/${item.url_sanpham.replace(/^\//, "")}`
        : null,
      rating_trung_binh: item.rating_trung_binh || null,
      tong_luot_ban: item.tong_luot_ban || 0,
    }));

    // ✅ 3. Trả kết quả
    return res.status(200).json({
      status: "success",
      shop: updatedShop,
      products: updatedProducts,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin shop:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Lỗi server: " + error.message,
    });
  }
};

const shop = { newshop, pageshop };
export default shop;
