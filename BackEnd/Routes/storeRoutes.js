import express from "express";
import multer from "multer";

import { verifyUserAuth, roleBasedAccess } from "../MiddleWare/userAuth.js";

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

//MULTER CONFIG 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/stores/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadStoreLogo = multer({ storage });

// STORE ROUTES

// CREATE STORE 
router.post(
  "/create",
  verifyUserAuth,
  uploadStoreLogo.single("logo"),
  createStore
);

// GET MY STORE (SELLER ONLY)
router.get(
  "/me",
  verifyUserAuth,
  roleBasedAccess("seller"),
  getMyStore
);

//SELLER PRODUCT ROUTES

// CREATE PRODUCT
router.post(
  "/seller/product/create",
  verifyUserAuth,
  roleBasedAccess("seller"),
  crateProduct
);

// GET SELLER PRODUCTS
router.get(
  "/seller/products",
  verifyUserAuth,
  roleBasedAccess("seller"),
  getSellerProducts
);

// UPDATE PRODUCT
router.put(
  "/seller/product/:id",
  verifyUserAuth,
  roleBasedAccess("seller"),
  updateProducts
);

// DELETE PRODUCT
router.delete(
  "/seller/product/:id",
  verifyUserAuth,
  roleBasedAccess("seller"),
  deleteProduct
);

export default router;