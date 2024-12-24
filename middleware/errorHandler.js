const { errorCodes } = require("../constants");
const logger = require("../winston/logger");

const errorHandler = (err, req, res, next) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400);
  }

  const statusCode = res.statusCode ? res.statusCode : 500;

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  switch (statusCode) {
    case errorCodes.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stack: err.stack,
      });
      break;
    case errorCodes.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stack: err.stack,
      });
      break;
    case errorCodes.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stack: err.stack,
      });
      break;
    case errorCodes.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stack: err.stack,
      });
      break;
    case errorCodes.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stack: err.stack,
      });
      break;
    default:
      //console.log("Unhandled Error");
      res.status(400).json({
        title: "Unknown Error",
        message: err.message,
        stack: err.stack || "An unknown error occurred",
      });
      break;
  }
};

module.exports = { errorHandler };
