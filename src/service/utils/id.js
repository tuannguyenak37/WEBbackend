import { v4 as uuidv4 } from "uuid";

/**
 * Sinh ID sản phẩm duy nhất với prefix
 * @param {string} prefix Ví dụ: "SP_"
 * @returns {string} SP_550e8400-e29b-41d4-a716-446655440000
 */
function generateProductId(prefix = "SP_") {
  return `${prefix}${uuidv4()}`;
}

export default generateProductId;
