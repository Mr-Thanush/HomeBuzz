import express from 'express';
import { roleBasedAccess, verifyUserAuth } from '../MiddleWare/userAuth.js';
import { allMyOrderDetails, allOrderDetails, createNewOrder, deleteOrder, singleOrderDetails, updateOrderStatus } from '../functions/orderFunction.js';
const router = express.Router();


router.route('/new/order').post(verifyUserAuth,createNewOrder);
router.route('/seller/order/:id')
.get(verifyUserAuth,roleBasedAccess("seller","admin"),singleOrderDetails)
.put(verifyUserAuth,roleBasedAccess("seller","admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess("seller","admin"),deleteOrder)
router.route('/seller/orders').get(verifyUserAuth,roleBasedAccess("seller","admin"),allOrderDetails)
router.route('/orders/user').get(verifyUserAuth,allMyOrderDetails)




export default router

