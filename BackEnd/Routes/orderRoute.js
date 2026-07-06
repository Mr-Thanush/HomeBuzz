import express from "express";
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../Controller/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleWare/userAuth.js";
import { isApprovedSeller } from "../middleWare/sellerApproval.js";

const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createNewOrder);

// FIX: Moved isApprovedSeller BEFORE the execution controllers
router.route("/order/:id")
  .get(verifyUserAuth, getSingleOrder)
  .put(verifyUserAuth, roleBasedAccess("seller", "admin"), isApprovedSeller, updateOrderStatus)
  .delete(verifyUserAuth, roleBasedAccess("seller", "admin"), isApprovedSeller, deleteOrder);

router.route("/seller/orders").get(
  verifyUserAuth,
  roleBasedAccess("admin", "seller"),
  isApprovedSeller,
  getAllOrders
);

router.route("/user/orders").get(verifyUserAuth, allMyOrders);

export default router;