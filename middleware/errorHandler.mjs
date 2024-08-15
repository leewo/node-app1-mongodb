import logger from "../logger.mjs";

// 에러 처리 개선
export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack, { error: 'details' });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
