import checkout_service from "../../service/checkout_service.js";
import checKHo from "../../service/utils/KhoCheck.js";
// Hàm nhóm sản phẩm theo shop_id
function groupByShopToArray(list_sanpham) {
  const grouped = {};

  list_sanpham.forEach((item) => {
    const { shop_id, ...rest } = item;
    if (!grouped[shop_id]) grouped[shop_id] = [];
    grouped[shop_id].push(rest);
  });

  return Object.entries(grouped).map(([shop_id, sanpham]) => ({
    shop_id,
    sanpham,
  }));
}

const new_checkout_controller = async (req, res) => {
  try {
    const {
      khachhang_id,
      hinh_thuc_thanh_toan,
      list_sanpham,
      giam_gia_tong_hd = 0,
    } = req.body;
    console.log("dữ kiệu  body", req.body);
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
    const grouped = groupByShopToArray(list_sanpham);
    console.log(
      ">>> mảng sản phẩm sau khi được lọc:",
      JSON.stringify(grouped, null, 2)
    );

    /// hàm ches xem  trong kho còn sản phẩm hay ko
    await checKHo.check_ton_kho(list_sanpham);
    // Tạo hóa đơn cho từng shop

    const results = [];

    for (const { shop_id, sanpham } of grouped) {
      const ghi_chu = grouped[0].sanpham[0].ghi_chu;
      console.log(
        "> ghi chú  ................. sssssssssssssssssssssssssssssssssssssssssss",
        ghi_chu
      );
      const data = await checkout_service.new_checkout_service(
        khachhang_id,
        hinh_thuc_thanh_toan,
        giam_gia_tong_hd,
        ghi_chu,
        { shop_id, sanpham }
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
