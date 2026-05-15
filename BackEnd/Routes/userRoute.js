import express from "express";
import { adminDeleteUser, adminSingleUser, adminUpdateUserRole, adminUsersList, getUserDetails, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updatePassword, updateUserDetails } from "../Controller/userController.js";
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
router.route('/admin/users').get(verifyUserAuth,roleBasedAccess("admin"), adminUsersList);
router.route('/seller/users').get(verifyUserAuth,roleBasedAccess("seller","admin"), adminUsersList);
router.route('/admin/user/:id')
.get(verifyUserAuth,roleBasedAccess("admin"), adminSingleUser)
.put(verifyUserAuth,roleBasedAccess("admin"), adminUpdateUserRole)
.delete(verifyUserAuth,roleBasedAccess("admin"), adminDeleteUser);


export default router; 