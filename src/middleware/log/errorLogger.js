import chalk from "chalk";
import logger from "./logger.js";

export default function errorLogger(err, req, res, next) {
  const message = `${chalk.red("[ERROR]")} ${chalk.yellow(
    req.method
  )} ${chalk.cyan(req.originalUrl)} → ${chalk.red(err.message)}`;

  logger.error(message, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  // Gửi phản hồi lỗi cho client (nếu chưa gửi)
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  next(err);
}
