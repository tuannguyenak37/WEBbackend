import revenue_servicice from "../../service/dasboard/revenue_servicice.js";
const doanh_thuof_shop = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    console.log(" shop id từ token:", shop_id);
    const { startDate, endDate } = req.query;
    const data = await revenue_servicice.doanh_thuof_shop(
      shop_id,
      startDate,
      endDate
    );
    res.status(200).json({
      status: "success",
      message: "Lấy doanh thu thành công",
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

const doanh_thu_theo_thang = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const { startDate, endDate } = req.query;
    console.log(" shop id từ token:", shop_id);
    const { month, year } = req.query;
    const data = await revenue_servicice.doanh_thu_theo_thang(
      shop_id,
      startDate,
      endDate
    );
    res.status(200).json({
      status: "success",
      message: "Lấy doanh thu theo tháng thành công",
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
export default { doanh_thuof_shop ,doanh_thu_theo_thang};
