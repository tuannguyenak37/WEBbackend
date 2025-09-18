import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Kết nối thất bại:", err.message);
  } else {
    console.log("✅ Chào mừng, kết nối thành công database");
  }
});

export default db; // Export object db, không phải function
