import newfeedback_service from "../../service/bill/feedback_service.js";
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
    await newfeedback_service.newfeedback_service(
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

const feedback = {
  newfeedback_controller,
};
export default feedback;
