import db from "../../config/db.js";
import feedback_service from "../../service/bill/feedback_service.js";
const newfeedback_controller = async (req, res) => {
  try {
    const { mota, sanpham_id, hoadon_id, rating } = req.body;
    const image_url = req.files;
    const user_id = req.user.user_id;
    console.log(" dữ liệu đánh giá", mota);
    console.log(" dữ liệu đánh giá", sanpham_id);

    if (!user_id) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy người dùng",
      });
    }
    if (!mota || !sanpham_id || !image_url || !rating) {
      return res.status(404).json({
        status: "fail",
        message: "vui lòng nhập đầy đủ thông tin",
      });
    }
    await feedback_service.newfeedback_service(
      user_id,
      mota,
      sanpham_id,

      hoadon_id,
      image_url,
      rating
    );
    res.status(200).json({
      message: " thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi khi:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const get_feedback_controller = async (req, res) => {
  try {
    const { shop_id, sanpham_id } = req.query;
    console.log(" dữ liệu đánh giá", shop_id);
    console.log(" dữ liệu đánh giá", sanpham_id);
    if (!shop_id || !sanpham_id) {
      return res.status(404).json({
        status: "fail",
        message: "vui lòng nhập đầy đủ thông tin",
      });
    }
    // Call service to get feedback data (service function not implemented here)
    const data = await feedback_service.get_feedback_service(
      shop_id,
      sanpham_id
    );
    res.status(200).json({
      status: "success",
      message: "Lấy feedback thành công",
      data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const feedback_of_shop_controller = async (req, res) => {
  try {
    const { shop_id } = req.params;
    if (!shop_id) {
      return res.status(404).json({
        status: "fail",
        message: "vui lòng nhập đầy đủ thông tin",
      });
    }
    // Call service to get feedback data (service function not implemented here)
    const data = await feedback_service.feedback_of_shop_service(shop_id);
    res.status(200).json({
      status: "success",
      message: "Lấy feedback của shop thành công",
      data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const get_average_rating_controller = async (req, res) => {
  try {
    const { sanpham_id } = req.params;
    if (!sanpham_id) {
      return res.status(404).json({
        status: "fail",
        message: "Vui lòng nhập `sanpham_id`",
      });
    }

    // Truy vấn MySQL: lấy rating trung bình != 0 và số lượng đánh giá
    const [rows] = await db.promise().execute(
      `SELECT 
          ROUND(AVG(rating), 2) AS avg_rating, 
          COUNT(*) AS total_feedback
       FROM feedback 
       WHERE sanpham_id = ? AND rating != 0`,
      [sanpham_id]
    );

    const avgRating = rows[0].avg_rating || null; // nếu không có feedback thì trả về null
    const totalFeedback = rows[0].total_feedback || 0; // số lượng feedback

    res.status(200).json({
      status: "success",
      message: "Lấy điểm trung bình và số lượt đánh giá thành công",
      data: {
        sanpham_id,
        avg_rating: avgRating,
        total_feedback: totalFeedback,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy rating trung bình:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const feedback = {
  newfeedback_controller,
  get_feedback_controller,
  feedback_of_shop_controller,
  get_average_rating_controller,
};
export default feedback;
