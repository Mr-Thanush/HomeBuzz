import express from "express";
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../Controller/orderController.js";
const router=express.Router();
import { roleBasedAccess, verifyUserAuth } from "../middleWare/userAuth.js"
import { isApprovedSeller } from "../middleWare/sellerApproval.js";

router.route("/new/order").post(verifyUserAuth, createNewOrder);
router.route("/order/:id")
.get(verifyUserAuth,getSingleOrder)
.put(verifyUserAuth,roleBasedAccess("seller","admin"),updateOrderStatus,  isApprovedSeller)
.delete(verifyUserAuth,roleBasedAccess("seller","admin"),deleteOrder, isApprovedSeller);

router.route("/seller/orders").get(
  verifyUserAuth,
  roleBasedAccess("admin", "seller"),
  isApprovedSeller,
  getAllOrders
);
router.route("/user/orders").get(verifyUserAuth, allMyOrders);






export default router;