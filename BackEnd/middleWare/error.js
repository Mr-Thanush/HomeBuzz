import handleError from "../utils/handleError.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  // --- Mongoose Errors ---
  if (err.name === "CastError") {
    const message = `Invalid resource ID: ${err.path}`;
    err = new handleError(message, 400);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((item) => item.message);
    err = new handleError(messages.join(", "), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `Duplicate field value: ${field}. Please use another value.`;
    err = new handleError(message, 400);
  }

  // --- MySQL Native Driver Errors ---
  if (err.code === "ER_DUP_ENTRY") {
    const message = "Email or unique field already exists. Please use another value.";
    err = new handleError(message, 400);
  }

  if (err.code === "ER_BAD_FIELD_ERROR") {
    err = new handleError("Database layout mismatch: Unknown column targeted.", 500);
  }

  // --- Security Token Errors ---
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    err = new handleError("Invalid or expired token. Please login again.", 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};