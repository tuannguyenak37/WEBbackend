import db from "../../config/db.js";
import idtao from "../../service/utils/id.js";

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

const shop = { newshop };
export default shop;
