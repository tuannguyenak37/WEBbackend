// service/bill/hoadon.js
import db from "../../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const getBillDetail_service = async (hoadon_id) => {
  const baseURL = `http://${process.env.HOST}:${process.env.PORT}`;

  // Lấy thông tin hóa đơn + khách hàng + địa chỉ (nếu có)
  const sqlBill = `
    SELECT
      hd.hoadon_id,
      hd.shop_id,
      hd.ngay_lap,
      hd.tong_tien,
      hd.hinh_thuc_thanh_toan,
      hd.trang_thai,
      hd.giam_gia_tong_hd,
      hd.ghi_chu,

      kh.ten_khachhang,
      kh.so_dien_thoai,

      dc.diachi_id,
      dc.dia_chi,
      dc.mo_ta_dia_chi,
      dc.district,
      dc.province,
      dc.ward

    FROM hoadon hd
    JOIN khachhang kh ON hd.khachhang_id = kh.khachhang_id
    LEFT JOIN dia_chi_giao_hang dc ON kh.khachhang_id = dc.khachhang_id
    WHERE hd.hoadon_id = ?
    LIMIT 1;
  `;

  // Lấy danh sách sản phẩm của hóa đơn
  const sqlProducts = `
    SELECT
      cthd.cthd_id,
      cthd.sanpham_id,
      cthd.so_luong,
      cthd.giam_gia_percent,
      cthd.thanh_tien,

      sp.ten_sanpham,
      sp.gia_ban,
      sp.mo_ta,
      sp.loai_sanpham,
      sp.giam_gia_SP,
      CONCAT('${baseURL}', sp.url_sanpham) AS url_sanpham

    FROM chitiethoadon cthd
    JOIN sanpham sp ON cthd.sanpham_id = sp.sanpham_id
    WHERE cthd.hoadon_id = ?;
  `;

  const [billRows] = await db.promise().execute(sqlBill, [hoadon_id]);
  const [prodRows] = await db.promise().execute(sqlProducts, [hoadon_id]);

  const hoadon = billRows.length
    ? {
        hoadon_id: billRows[0].hoadon_id,
        shop_id: billRows[0].shop_id,
        ngay_lap: billRows[0].ngay_lap,
        tong_tien: billRows[0].tong_tien,
        hinh_thuc_thanh_toan: billRows[0].hinh_thuc_thanh_toan,
        trang_thai: billRows[0].trang_thai,
        giam_gia_tong_hd: billRows[0].giam_gia_tong_hd,
        ghi_chu: billRows[0].ghi_chu,
        khachhang: {
          ten_khachhang: billRows[0].ten_khachhang,
          so_dien_thoai: billRows[0].so_dien_thoai,
        },
        dia_chi: billRows[0].diachi_id
          ? {
              diachi_id: billRows[0].diachi_id,
              dia_chi: billRows[0].dia_chi,
              mo_ta_dia_chi: billRows[0].mo_ta_dia_chi,
              district: billRows[0].district,
              province: billRows[0].province,
              ward: billRows[0].ward,
            }
          : null,
      }
    : null;

  const sanpham = prodRows.map((p) => ({
    cthd_id: p.cthd_id,
    sanpham_id: p.sanpham_id,
    ten_sanpham: p.ten_sanpham,
    gia_ban: p.gia_ban,
    mo_ta: p.mo_ta,
    loai_sanpham: p.loai_sanpham,
    giam_gia_SP: p.giam_gia_SP,
    url_sanpham: p.url_sanpham,
    so_luong: p.so_luong,
    giam_gia_percent: p.giam_gia_percent,
    thanh_tien: p.thanh_tien,
  }));

  return { hoadon, sanpham };
};

export default {
  getBillDetail_service,
};
