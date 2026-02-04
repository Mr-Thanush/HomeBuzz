import express from "express";
import multer from "multer";
import path from "path";

import {
  crateProduct,
  getSellerProducts,
  deleteProduct,
  updateProducts,
  SingleAccessingProduct,
  getAllProducts,
  createAndUpdateReview,
  getProductReviews,
  deletingReview,
} from "../functions/productFunctions.js";

import { roleBasedAccess, verifyUserAuth } from "../MiddleWare/userAuth.js";

const router = express.Router();

/*MULTER CONFIG */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* SELLER ROUTES*/

// GET ALL PRODUCTS OF SELLER
router.get(
  "/seller/products",
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  getSellerProducts
);

// CREATE PRODUCT
router.post(
  "/seller/product/create",
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  upload.single("image"),
  crateProduct
);

// GET SINGLE PRODUCT (SELLER)
router.get(
  "/seller/product/:id",
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  async (req, res, next) => {
    try {
      const product = await SingleAccessingProduct(req, res, next);
      return product;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  }
);

// UPDATE PRODUCT
router.put(
  "/seller/product/:id",
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  updateProducts
);

// DELETE PRODUCT
router.delete(
  "/seller/product/:id",
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  deleteProduct
);

/* PUBLIC ROUTES*/

// GET ALL PRODUCTS (PUBLIC)
router.get("/products", getAllProducts);

// GET SINGLE PRODUCT (PUBLIC)
router.get("/product/:id", SingleAccessingProduct);

/* REVIEWS */

// CREATE / UPDATE REVIEW
router.post(
  "/product/review",
  verifyUserAuth,
  createAndUpdateReview
);

// GET PRODUCT REVIEWS
router.get(
  "/product/reviews",
  getProductReviews
);

// DELETE REVIEW
router.delete(
  "/product/review",
  verifyUserAuth,
  deletingReview
);

export default router;