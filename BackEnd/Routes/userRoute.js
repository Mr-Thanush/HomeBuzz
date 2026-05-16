import express from "express";
import { adminDeleteUser, adminSingleUser, adminUpdateUserRole, adminUsersList, becomeSeller, getSellerRequests, approveSellerRequest, rejectSellerRequest, getUserDetails, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updatePassword, updateUserDetails } from "../Controller/userController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleWare/userAuth.js";


const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/password/forgot').post(requestPasswordReset);
router.route('/reset/:token').post(resetPassword);
router.route('/profile').get(verifyUserAuth, getUserDetails);
router.route('/password/update').put(verifyUserAuth, updatePassword);
router.route('/profile/update').put(verifyUserAuth, updateUserDetails);
router.route("/seller/create").put(verifyUserAuth, becomeSeller);
router.route('/admin/seller/requests').get(verifyUserAuth, roleBasedAccess("admin"), getSellerRequests);
router.route('/admin/seller/approve/:id').put(verifyUserAuth, roleBasedAccess("admin"), approveSellerRequest);
router.route('/admin/seller/reject/:id').delete(verifyUserAuth, roleBasedAccess("admin"), rejectSellerRequest);
router.route('/admin/users').get(verifyUserAuth,roleBasedAccess("admin"), adminUsersList);
router.route('/seller/users').get(verifyUserAuth,roleBasedAccess("seller","admin"), adminUsersList);
router.route('/admin/user/:id')
.get(verifyUserAuth,roleBasedAccess("admin"), adminSingleUser)
.put(verifyUserAuth,roleBasedAccess("admin"), adminUpdateUserRole)
.delete(verifyUserAuth,roleBasedAccess("admin"), adminDeleteUser);


export default router; 