import logger from "./logger.js";

export default function errorLogger(err, req, res, next) {
  logger.error("Error Occurred", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  next(err);
}
