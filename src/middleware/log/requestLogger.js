import chalk from "chalk";
import logger from "./logger.js";

// 🛡️ Ẩn thông tin nhạy cảm
const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const clone = { ...obj };
  if (clone.password) clone.password = "******";
  if (clone.token) clone.token = "******";
  return clone;
};

const requestLogger = (req, res, next) => {
  const start = Date.now();

  try {
    logger.info(
      `${chalk.cyan("[REQUEST]")} ${chalk.green(req.method)} ${chalk.yellow(
        req.originalUrl
      )}`
    );

    // ✅ Chỉ log nếu có dữ liệu
    if (req.params && Object.keys(req.params).length)
      logger.info(`${chalk.magenta("➡ Params:")} ${JSON.stringify(req.params)}`);

    if (req.query && Object.keys(req.query).length)
      logger.info(`${chalk.blue("🔍 Query:")} ${JSON.stringify(req.query)}`);

    if (req.body && Object.keys(req.body).length)
      logger.info(
        `${chalk.yellow("🧾 Body:")} ${JSON.stringify(sanitize(req.body))}`
      );
  } catch (err) {
    logger.error(`❌ Error while logging request: ${err.message}`);
  }

  // --- Log response ---
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const statusColor =
      statusCode >= 500
        ? chalk.red
        : statusCode >= 400
        ? chalk.yellow
        : chalk.green;

    const message = `${chalk.cyan("[RESPONSE]")} ${chalk.green(
      req.method
    )} ${chalk.yellow(req.originalUrl)} → ${statusColor(
      statusCode
    )} ${chalk.gray(`(${duration}ms)`)}`;

    if (statusCode >= 400) logger.error(message);
    else logger.info(message);
  });

  next();
};

export default requestLogger;
