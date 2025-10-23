import db from "../../config/db.js";

const doanh_thuof_shop = async (shop_id, startDate, endDate) => {
  try {
    if (!shop_id) {
      throw new Error("Thiếu shop_id");
    }

    // Câu truy vấn tổng doanh thu (không nhóm theo ngày)
    let query = `
      SELECT 
        SUM(tong_tien - IFNULL(giam_gia_tong_hd, 0)) AS tong_doanh_thu,
        COUNT(*) AS tong_don_hang
      FROM hoadon
      WHERE shop_id = ?
      AND trang_thai IN ('đã giao', 'hoàn thành')
    `;

    const params = [shop_id];

    if (startDate && endDate) {
      query += " AND DATE(ngay_lap) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    } else if (startDate) {
      query += " AND DATE(ngay_lap) >= ?";
      params.push(startDate);
    } else if (endDate) {
      query += " AND DATE(ngay_lap) <= ?";
      params.push(endDate);
    }

    const [rows] = await db.promise().execute(query, params);

    // Trả về tổng doanh thu và số đơn hàng
    return {
      tong_doanh_thu: rows[0]?.tong_doanh_thu || 0,
      tong_don_hang: rows[0]?.tong_don_hang || 0,
    };
  } catch (error) {
    console.error("Lỗi truy vấn doanh thu tổng quan:", error);
    throw error;
  }
};

const doanh_thu_theo_thang = async (shop_id, startMonth, endMonth) => {
  try {
    if (!shop_id) {
      throw new Error("Thiếu shop_id");
    }

    // Truy vấn tổng doanh thu theo tháng
    let query = `
      SELECT 
        DATE_FORMAT(ngay_lap, '%Y-%m') AS thang,
        SUM(tong_tien - IFNULL(giam_gia_tong_hd, 0)) AS tong_doanh_thu,
        COUNT(*) AS tong_don_hang
      FROM hoadon
      WHERE shop_id = ?
      AND trang_thai IN ('đã giao', 'hoàn thành')
    `;

    const params = [shop_id];

    // Nếu người dùng chọn khoảng tháng, thêm điều kiện lọc
    if (startMonth && endMonth) {
      query += " AND DATE_FORMAT(ngay_lap, '%Y-%m') BETWEEN ? AND ?";
      params.push(startMonth, endMonth);
    } else if (startMonth) {
      query += " AND DATE_FORMAT(ngay_lap, '%Y-%m') >= ?";
      params.push(startMonth);
    } else if (endMonth) {
      query += " AND DATE_FORMAT(ngay_lap, '%Y-%m') <= ?";
      params.push(endMonth);
    }

    query += `
      GROUP BY DATE_FORMAT(ngay_lap, '%Y-%m')
      ORDER BY thang ASC
    `;

    const [rows] = await db.promise().execute(query, params);

    return rows; // Mảng doanh thu theo từng tháng
  } catch (error) {
    console.error("Lỗi truy vấn doanh thu theo tháng:", error);
    throw error;
  }
};

export default { doanh_thuof_shop , doanh_thu_theo_thang };
