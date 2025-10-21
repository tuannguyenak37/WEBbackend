import db from "../../config/db.js";

const check_feedback = async (req, res) => {
  console.log("body", req.body);
  const { sanpham_id, hoadon_id } = req.query; // Lấy từ query params

  try {
    // Kiểm tra trạng thái hóa đơn
    const [hoadonData] = await db
      .promise()
      .execute(`SELECT trang_thai FROM hoadon WHERE hoadon_id = ?`, [
        hoadon_id,
      ]);

    if (!hoadonData || !hoadonData.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Hóa đơn không tồn tại.",
      });
    }

    const trangThai = hoadonData[0].trang_thai;
    console.log("Trạng thái hóa đơn:", trangThai);

    if (trangThai !== "đã giao") {
      return res.status(200).json({
        status: "not",
        message: "Hóa đơn chưa được giao, không thể thêm feedback.",
      });
    }

    // Kiểm tra feedback cho sản phẩm trong hóa đơn
    const [feedbackRows] = await db
      .promise()
      .execute(
        `SELECT * FROM feedback WHERE sanpham_id = ? AND hoadon_id = ?`,
        [sanpham_id, hoadon_id]
      );

    const feedbackExists = feedbackRows.length > 0;

    if (feedbackExists) {
      return res.status(200).json({
        status: "Exists",
        message: "Đã tồn tại feedback cho sản phẩm này trong hóa đơn.",
      });
    } else {
      return res.status(200).json({
        status: "Ok",
        message: "Chưa có feedback cho sản phẩm này, có thể thêm mới.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra feedback:", error);
    return res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi kiểm tra feedback.",
      error: error.message,
    });
  }
};

export default { check_feedback };
