const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : error.code === 'ER_DUP_ENTRY'
      ? 409
      : error.code === 'ER_NO_REFERENCED_ROW_2'
        ? 400
        : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  const response = {
    message: statusCode >= 500 ? 'Internal server error' : error.message
  };
  if (error.details) {
    response.details = error.details;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
