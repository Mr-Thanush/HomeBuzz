import handleError from "../utils/handleError.js";

export const isApprovedSeller = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  if (!req.user?.sellerInfo) {
    return next(new handleError("Store not found", 403));
  }

  if (req.user.sellerInfo.status !== "approved") {
    return next(new handleError("Store not approved yet", 403));
  }

  next();
};