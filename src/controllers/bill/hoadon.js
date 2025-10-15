import hoadon_service from "../../service/bill/hoadon.js";

const getallBill = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy người dùng",
      });
    }

    const data = await hoadon_service.getall_service(user_id);
    return res.status(200).json({
      status: "success",
      message: "Lấy danh sách hóa đơn cơ bản theo user_id thành công",
      data: data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy hóa đơn theo user_id:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getallBill_shopid = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    if (!shop_id) {
      return res.status(404).json({
        status: "fail",
        message: "Không tìm thấy shop_id",
      });
    }

    const data = await hoadon_service.getall_service_shopid(shop_id);
    return res.status(200).json({
      status: "success",
      message: `Lấy danh sách hóa đơn theo shop_id ${shop_id} thành công`,
      data: data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy hóa đơn theo shop_id:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
// ✅ Controller mới: cập nhật trạng thái hóa đơn
const updateBillStatus = async (req, res) => {
  try {
    const { trang_thai, hoadon_id } = req.body;
    console.log("trạng thái", req.body);
    if (!hoadon_id || !trang_thai) {
      return res.status(400).json({
        status: "fail",
        message: "Vui lòng cung cấp hoadon_id và trạng_thai mới",
      });
    }

    // Có thể kiểm tra thêm trạng thái cũ để tránh đổi trạng thái "đã giao" nếu muốn
    const result = await hoadon_service.updateStatusById(hoadon_id, trang_thai);

    return res.status(200).json({
      status: "success",
      message: `Cập nhật trạng thái hóa đơn ${hoadon_id} thành công`,
      data: result,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái hóa đơn:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
/** 💸 Cập nhật trạng thái hóa đơn thành "trả hàng / hoàn tiền" */
export const updateBillRefunded = async (req, res) => {
  try {
    const { trang_thai, hoadon_id } = req.body;
    if (!hoadon_id) {
      return res.status(400).json({
        status: "fail",
        message: "Thiếu hoadon_id",
      });
    }

    const result = await hoadon_service.updateStatusById(hoadon_id, trang_thai);

    return res.status(200).json({
      status: "success",
      message: `Đơn hàng ${hoadon_id} đã được chuyển sang trạng thái `,
      data: result,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái ", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const bill_Controller = {
  getallBill,
  getallBill_shopid,
  updateBillStatus,
  updateBillRefunded,
};
export default bill_Controller;
