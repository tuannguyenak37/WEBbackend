import logger from "./logger.js";

const requestLogger = (req, res, next) => {
  logger.info("Incoming Request", {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
};
export default requestLogger;
