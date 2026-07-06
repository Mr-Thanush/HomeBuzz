import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";
import { mysqlPool } from "../config/db.js";

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

  // Look up user row in MySQL instead of MongoDB
  const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [decodedData.id]);
  const userRow = rows[0];

  if (!userRow) {
    return next(new handleError("User no longer exists.", 401));
  }

  // Construct standard user profile shape for request context lifecycle matching controllers
  req.user = {
    _id: userRow.id, // Keeping _id for backwards compatibility matching req.user._id
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    profilepic: {
        public_id: userRow.profile_pic_id,
        url: userRow.profile_pic_url
    },
    sellerInfo: userRow.seller_status !== "none" ? {
        storeName: userRow.store_name,
        description: userRow.store_description,
        phone: userRow.phone,
        altPhone: userRow.alt_phone,
        address: userRow.address,
        status: userRow.seller_status
    } : undefined
  };

  next();
});

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new handleError(`Access denied for role: ${req.user.role}`, 403));
    }
    next();
  };
};