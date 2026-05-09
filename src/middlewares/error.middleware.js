// global error handling middleware

const errorHandler = (err, req, res, next) => {

  // extract error details
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // send standardized error response
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development"
      ? err.stack
      : undefined,
  });
};

export default errorHandler;