// service/bill/hoadon.js
import db from "../../config/db.js";
import dotenv from "dotenv";
import id from "../utils/id.js";
dotenv.config();

const newfeedback_service = async (
  user_id,
  mota,
  sanpham_id,

  hoadon_id,
  image_url,
  rating
) => {
  console.log(" dữ liệu đánh giá", image_url);
  console.log({
    mota,
    user_id,
    sanpham_id,
    hoadon_id,
  });

  try {
    const connection = db.promise();
    await connection.beginTransaction();
    const feedback_id = id("FB_");

    await connection.execute(
      `INSERT INTO feedback(feedback_id,mota, user_id, sanpham_id,hoadon_id,rating) VALUES (?,?,?,?,?,?)`,
      [feedback_id, mota, user_id, sanpham_id, hoadon_id, rating]
    );
    for (let i of image_url) {
      console.log("tên file", i.filename);
      const feedback_images_id = id("FBimg_");
      await connection.execute(
        `INSERT INTO feedback_images(feedback_images_id, feedback_id, image_url) VALUES (?,?,?)`,
        [feedback_images_id, feedback_id, i.filename]
      );
    }

    await connection.commit();
  } catch (error) {
    throw error;
  }
};
export default { newfeedback_service };
