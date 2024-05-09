import logger from '../utils/log.js';

const log = (req, res, next) => {
  const start = new Date();
  next();
  const ms = new Date() - start;
  logger.info(
    `\nRequest method:\t\t${req.method}\nRequest URL:\t\t${req.originalUrl}\nResponse status code:\t${res.statusCode}\nResponse duration:\t${ms} ms`
  );
};

export default log;
