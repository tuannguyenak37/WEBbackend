import { v4 as uuidv4 } from "uuid";

/**
 * Sinh ID sản phẩm ngắn gọn nhưng vẫn duy nhất
 * @param {string} prefix Ví dụ: "SP_"
 * @param {number} length Độ dài phần UUID rút gọn, mặc định 8 ký tự
 * @returns {string} SP_ + chuỗi duy nhất rút gọn
 */
function generateProductId(prefix = "SP_", length = 8) {
  // Lấy UUID, loại bỏ dấu '-', chuyển sang số lớn (BigInt)
  const uuidNum = BigInt("0x" + uuidv4().replace(/-/g, ""));
  // Chuyển sang Base36 (0-9 + a-z), sau đó cắt độ dài
  const shortId = uuidNum.toString(36).substring(0, length);
  return `${prefix}${shortId}`;
}

export default generateProductId;
