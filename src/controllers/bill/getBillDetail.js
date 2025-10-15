// controllers/bill/hoadon.js
import getBillDetail_service from "../../service/bill/getBillDetail_service .js";
const getBillDetail = async (req, res) => {
  try {
    const { hoadon_id } = req.params;

    if (!hoadon_id) {
      return res.status(400).json({
        status: "fail",
        message: "Thiếu mã hóa đơn (hoadon_id)",
      });
    }

    const data = await getBillDetail_service.getBillDetail_service(hoadon_id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy chi tiết hóa đơn",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Lấy chi tiết hóa đơn thành công",
      data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết hóa đơn:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export default {
  getBillDetail,
};
