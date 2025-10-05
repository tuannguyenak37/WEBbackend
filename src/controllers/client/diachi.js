import diachi_service from "../../service/diachi_service.js";
const new_diachi_controller = async (req, res) => {
    console.log("Body:", req.body);
  const { dia_chi, mo_ta_dia_chi, khachhang_id } = req.body;
  try {
    if (!dia_chi || !mo_ta_dia_chi || !khachhang_id)
      return res.status(400).json({
        message: " thiếu thông tin địa chỉ",
      });

    const data = await diachi_service.new_diachi_service(
      dia_chi,
      mo_ta_dia_chi,
      khachhang_id
    );

    return res.status(200).json({
      status: "success",
      message: " tạo địa chỉ thành công",
    });
  } catch (error) {
    console.error("❌ lỗi data base:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const diachi_Controller = { new_diachi_controller };
export default diachi_Controller;
