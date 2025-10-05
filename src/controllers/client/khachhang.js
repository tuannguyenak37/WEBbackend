import khachhang_service from "../../service/khachhang_service.js";
const newKHcontroller = async (req, res) => {
  const user_id = req.user.user_id;
  const { ten_khachhang, so_dien_thaoi } = req.body;
  console.log(">>>>", ten_khachhang, so_dien_thaoi);

  try {
    if (!ten_khachhang || !so_dien_thaoi)
      return res.status(400).json({
        message: " thiếu thông tin khách hàng",
      });

    const data = await khachhang_service.new_khachhang_service(
      user_id,
      ten_khachhang,
      so_dien_thaoi
    );

    return res.status(200).json({
      status: "success",
      message: " tạo khách hàng thành công",
      data: data,
    });
  } catch (error) {
    console.error("❌ lỗi data base:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const khachhang_Controller = { newKHcontroller };
export default khachhang_Controller;
