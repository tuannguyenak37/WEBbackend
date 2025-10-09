import diachi_service from "../../service/diachi_service.js";

const new_diachi_controller = async (req, res) => {
  console.log("Body:", req.body);
  const { khachhang_id, dia_chi, mo_ta_dia_chi, province, district, ward } =
    req.body;

  try {
    if (!khachhang_id || !dia_chi)
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ" });

    const data = await diachi_service.new_diachi_service({
      khachhang_id,
      dia_chi,
      mo_ta_dia_chi,
      province,
      district,
      ward,
    });

    return res.status(200).json({
      status: "success",
      message: "Tạo địa chỉ thành công",
      data,
    });
  } catch (error) {
    console.error("❌ Lỗi database:", error);
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

const diachi_Controller = { new_diachi_controller };
export default diachi_Controller;
