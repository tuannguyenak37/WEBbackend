import checkout_service from "../../service/checkout_service.js";

// Hàm nhóm sản phẩm theo shop_id
const groupByShop = (list_sanpham) => {
  return list_sanpham.reduce((grouped, sp) => {
    if (!grouped[sp.shop_id]) {
      grouped[sp.shop_id] = [];
    }
    grouped[sp.shop_id].push(sp);
    return grouped;
  }, {});
};

const new_checkout_controller = async (req, res) => {
  try {
    const {
      khachhang_id,
      hinh_thuc_thanh_toan,
      ghi_chu,
      list_sanpham,
      giam_gia_tong_hd = 0,
    } = req.body;

    // Validate input
    if (
      !khachhang_id ||
      !hinh_thuc_thanh_toan ||
      !Array.isArray(list_sanpham) ||
      list_sanpham.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin hóa đơn hoặc sản phẩm" });
    }

    // Nhóm sản phẩm theo shop_id
    const grouped = groupByShop(list_sanpham);

    // Tạo hóa đơn cho từng shop
    const results = [];
    
    for (const shop_id in grouped) {
      const data = await checkout_service.new_checkout_service(
        khachhang_id,
        shop_id,
        hinh_thuc_thanh_toan,
        giam_gia_tong_hd,
        ghi_chu,
        grouped[shop_id]
      );
      results.push({
        shop_id,
        ...data,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Tạo ${results.length} hóa đơn thành công`,
      data: results,
    });
  } catch (error) {
    console.error("❌ Lỗi database:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const checkout_Controller = { new_checkout_controller };
export default checkout_Controller;
