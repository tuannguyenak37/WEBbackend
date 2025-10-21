import db from "../../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const base_url = process.env.URL_IMAGE || "";

/**
 * Hàm tìm kiếm sản phẩm theo từ khóa, có hỗ trợ limit & page (pagination)
 * @param {string} keyword - từ khóa tìm kiếm
 * @param {number} limit - số lượng kết quả trả về (user có thể chọn) (mặc định 20)
 * @param {number} page - trang hiện tại (mặc định 1)
 * @returns {Promise<Array>} danh sách sản phẩm phù hợp
 */
const search_service = async (keyword, limit = 10, page = 1) => {
  try {
    // Nếu không nhập keyword, trả về rỗng để tránh query toàn bảng
    if (!keyword || keyword.trim() === "") return [];

    // Validate & sanitize limit/page
    const MAX_LIMIT = 100;
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    if (Number.isNaN(limit) || limit <= 0) limit = 20;
    if (Number.isNaN(page) || page <= 0) page = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const offset = (page - 1) * limit;

    // Câu truy vấn — KHÔNG dùng ? cho LIMIT/OFFSET
    const sql = `
      SELECT 
        s.sanpham_id,
        s.ten_sanpham,
        s.gia_ban,
        CONCAT(?, s.url_sanpham) AS url_sanpham,
        s.loai_sanpham,
        s.shop_id,
        sh.ten_shop,
        CONCAT(?, sh.url_shop) AS url_shop
      FROM sanpham AS s
      JOIN shop AS sh ON s.shop_id = sh.shop_id
      WHERE s.ten_sanpham LIKE ? 
         OR s.loai_sanpham LIKE ?
         OR sh.ten_shop LIKE ?
      LIMIT ${limit} OFFSET ${offset};
    `;

    // Thêm dấu % để tìm gần đúng
    const likeKeyword = `%${keyword}%`;

    // Thực thi truy vấn
    const [rows] = await db
      .promise()
      .execute(sql, [
        base_url,
        base_url,
        likeKeyword,
        likeKeyword,
        likeKeyword,
      ]);

    return rows;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    throw error;
  }
};

export default { search_service };
