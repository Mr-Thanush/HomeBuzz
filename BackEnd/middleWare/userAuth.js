import User from "../Models/userModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const token = req.cookies?.token || req.headers["x-access-token"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new handleError("Authentication required. Please log in.", 401));
  }

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    return next(new handleError("Invalid or expired token. Please login again.", 401));
  }

  const user = await User.findById(decodedData.id).select("-password -resetPasswordToken -resetPasswordExpire");
  if (!user) {
    return next(new handleError("User no longer exists.", 401));
  }

  req.user = user;
  next();
});

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new handleError(`Access denied for role: ${req.user.role}`, 403));
    }
    next();
  };
};
 