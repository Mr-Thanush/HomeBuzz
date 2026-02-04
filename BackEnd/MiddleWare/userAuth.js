import handleError from "../utils/handleError.js";
import asyncErrors from "./asyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const verifyUserAuth = asyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new handleError(
        "Authentication is missing! Please login to access resource",
        401
      )
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(
      new handleError("User not found. Please login again.", 401)
    );
  }

  next();
});

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new handleError(
          `Role - ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};