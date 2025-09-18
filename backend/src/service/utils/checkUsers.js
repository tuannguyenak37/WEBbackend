import db from "../../config/db.js"; // lấy object db trực tiếp


// checkEmail.js
const checkEmailExist = async (email) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows.length > 0; // true nếu email tồn tại
};

// checkPhone.js
const checkPhoneExist = async (phone) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM users WHERE phone = ?`, [phone]);
  return rows.length > 0; // true nếu phone tồn tại
};

const checkUser_name = async (user_name) => {
  const [rows] = await db
    .promise()
    .query(`SELECT * FROM users WHERE user_name = ?`, [user_name]);
  return rows.length > 0;
};

const check = { checkEmailExist, checkPhoneExist, checkUser_name };
export default check;
