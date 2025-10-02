import db from "../../config/db.js";
import idtao from "../../service/utils/id.js";

const shop = async (req, res) => {
  const user_id = req.user.user_id; // Lấy từ middleware auth
  const shop_id = idtao("shop");
  const { ten_shop, mo_ta, the_loai } = req.body;
  console.log(">>>>>>>>>", user_id, shop_id);
  try {
    // Sử dụng prepared statement
    const [rows] = await db.promise().execute(
      `INSERT INTO shop (shop_id, user_id, ten_shop, mo_ta, the_loai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [shop_id, user_id, ten_shop, mo_ta, the_loai]
    );

    return res.status(200).json({
      status: "success",
      data: {
        shop_id,
        user_id,
        ten_shop,
        mo_ta,
        the_loai,
      },
    });
  } catch (error) {
    console.error("❌ Error in shop controller:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export default shop;
