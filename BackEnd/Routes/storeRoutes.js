import express from "express";
import multer from "multer";
import { verifyUserAuth } from "../MiddleWare/userAuth.js";

import {
  createStore,
  getMyStore,
} from "../functions/storeFunction.js";

import {
  crateProduct,
  getSellerProducts,
  updateProducts,
  deleteProduct,
} from "../functions/productFunctions.js";

const router = express.Router();


// MULTER CONFIG (STORE ONLY)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/stores/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStoreLogo = multer({ storage });


//  STORE ROUTES

// CREATE STORE (with logo)
router.post(
  "/create",
  verifyUserAuth,
  uploadStoreLogo.single("logo"),
  createStore
);

// GET MY STORE
router.get("/me", verifyUserAuth, getMyStore);

// PRODUCT SELLER ROUTES

// CREATE PRODUCT (NO IMAGE)
router.post(
  "/seller/product/create",
  verifyUserAuth,
  crateProduct
);

// GET SELLER PRODUCTS
router.get(
  "/seller/products",
  verifyUserAuth,
  getSellerProducts
);

// UPDATE PRODUCT
router.put(
  "/seller/product/:id",
  verifyUserAuth,
  updateProducts
);

// DELETE PRODUCT
router.delete(
  "/seller/product/:id",
  verifyUserAuth,
  deleteProduct
);

export default router;