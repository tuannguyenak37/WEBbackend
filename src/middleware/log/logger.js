import winston from "winston";
import path from "path";
import fs from "fs";

// Định nghĩa folder log
const logDir = path.join(process.cwd(), "logs");

// Tạo folder nếu chưa tồn tại
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Tạo logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message} ${
          info.meta ? JSON.stringify(info.meta, null, 2) : ""
        }`
    )
  ),
  transports: [
    // Log ra console đẹp
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    // Log tất cả thông tin ra file
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    // Log riêng lỗi ra file
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
});

export default logger;
