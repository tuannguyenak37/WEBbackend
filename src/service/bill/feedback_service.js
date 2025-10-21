import db from "../../config/db.js";
import dotenv from "dotenv";
import id from "../utils/id.js";
dotenv.config();

const base_url = `http://${process.env.HOSTBAKCEND}:${process.env.PORT}`;

const newfeedback_service = async (
  user_id,
  mota,
  sanpham_id,
  hoadon_id,
  image_url,
  rating
) => {
  console.log("Dữ liệu đánh giá:", {
    mota,
    user_id,
    sanpham_id,
    hoadon_id,
    rating,
  });

  const connection = await db.promise().getConnection(); // ✅ lấy connection riêng

  try {
    await connection.beginTransaction(); // ✅ giờ có thể dùng được

    const feedback_id = id("FB_");

    await connection.execute(
      `INSERT INTO feedback(feedback_id, mota, user_id, sanpham_id, hoadon_id, rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [feedback_id, mota, user_id, sanpham_id, hoadon_id, rating]
    );

    // Nếu có hình ảnh thì lưu
    for (let i of image_url || []) {
      const feedback_images_id = id("FBimg_");
      await connection.execute(
        `INSERT INTO feedback_images(feedback_images_id, feedback_id, image_url)
         VALUES (?, ?, ?)`,
        [feedback_images_id, feedback_id, i.filename]
      );
    }

    await connection.commit();
    console.log("✅ Ghi feedback thành công!");
  } catch (error) {
    await connection.rollback(); // ✅ rollback nếu lỗi
    console.error("❌ Lỗi khi thêm feedback:", error);
    throw error;
  } finally {
    connection.release(); // ✅ trả connection về pool
  }
};
const get_feedback_service = async (shop_id, sanpham_id) => {
  try {
    const [rows] = await db.promise().execute(
      `SELECT 
          f.feedback_id, 
          f.mota, 
          f.user_id, 
          f.sanpham_id, 
          f.hoadon_id, 
          f.rating, 
          f.created_at,
          JSON_ARRAYAGG(fi.image_url) AS images,
          u.first_name,
          u.last_name,
          u.avatar_url
      FROM feedback f
      LEFT JOIN feedback_images fi ON f.feedback_id = fi.feedback_id
      INNER JOIN sanpham s ON f.sanpham_id = s.sanpham_id
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE f.sanpham_id = ?
        AND s.shop_id = ?
      GROUP BY f.feedback_id;`,
      [sanpham_id, shop_id] // Thứ tự phải khớp với dấu '?'
    );
    const data = rows.map((item) => ({
      ...item,
      images: item.images
        ? item.images.map((img) => `${base_url}/feedback_images/${img}`)
        : [],
      avatar_url: item.avatar_url ? `${base_url}/${item.avatar_url}` : null,
    }));
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy feedback:", error);
    throw error;
  }
};
const feedback_of_shop_service = async (shop_id) => {
  console.log("Shop ID nhận được:", shop_id);
  try {
    const [rows] = await db.promise().execute(
      `
       SELECT 
    ROUND(IFNULL(AVG(fb.rating), 0), 2) AS rating_trung_binh_shop,
    COUNT(fb.feedback_id) AS tong_feedback_shop
FROM sanpham sp
LEFT JOIN feedback fb 
    ON sp.sanpham_id = fb.sanpham_id 
    AND fb.rating > 0
WHERE sp.shop_id = ?;

        `,
      [shop_id]
    );

    return rows;
  } catch (error) {
    console.error("❌ Lỗi khi lấy feedback:", error);
    throw error;
  }
};

export default {
  newfeedback_service,
  get_feedback_service,
  feedback_of_shop_service,
};
