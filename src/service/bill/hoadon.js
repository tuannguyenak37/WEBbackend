import db from "../../config/db.js";

const getall_service = async (user_id) => {
  try {
    const [res] = await db.promise().execute(
      `
      SELECT 
        hd.hoadon_id,
        hd.khachhang_id,
        hd.shop_id,
        hd.ngay_lap,
        hd.tong_tien,
        hd.hinh_thuc_thanh_toan,
        hd.trang_thai,
        hd.giam_gia_tong_hd,
        hd.ghi_chu
      FROM hoadon hd
      JOIN khachhang kh ON hd.khachhang_id = kh.khachhang_id
      WHERE kh.user_id = ?
      ORDER BY hd.ngay_lap DESC
      `,
      [user_id]
    );
    console.log(">>>> Data :", res);
    return res;
  } catch (error) {
    throw error;
  }
};
const getall_service_shopid = async (shop_id) => {
  try {
    const [res] = await db.promise().execute(
      `
      SELECT 
        hd.hoadon_id,
        hd.khachhang_id,
        hd.shop_id,
        hd.ngay_lap,
        hd.tong_tien,
        hd.hinh_thuc_thanh_toan,
        hd.trang_thai,
        hd.giam_gia_tong_hd,
        hd.ghi_chu,
        s.ten_shop,
        s.mo_ta,
        s.the_loai,
        s.ngay_tao
        
      FROM hoadon hd
      JOIN shop s ON hd.shop_id = s.shop_id
      WHERE hd.shop_id = ?
      ORDER BY hd.ngay_lap DESC
      `,
      [shop_id]
    );
    return res;
  } catch (error) {
    throw error;
  }
};
const updateStatusById = async (hoadon_id, newStatus) => {
  try {
    const [res] = await db.promise().execute(
      `
      UPDATE hoadon
      SET trang_thai = ?
      WHERE hoadon_id = ?
      `,
      [newStatus, hoadon_id]
    );
    console.log(
      `Hóa đơn ${hoadon_id} đã được cập nhật trạng thái thành: ${newStatus}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const bill_service = {
  getall_service,
  getall_service_shopid,
  updateStatusById,
};
export default bill_service;
