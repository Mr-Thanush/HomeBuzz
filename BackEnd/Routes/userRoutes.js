import express from 'express';
import { ChangingUserRole, deletingUser, getSingleUserList, getUserDetails, getUserList, SignInUser, SignOutUser, SignUpUser, updateUserProfile } from '../functions/userFunctions.js';
const router=express.Router();
import { roleBasedAccess, verifyUserAuth } from '../MiddleWare/userAuth.js';

router.route('/signup').post(SignUpUser)
router.route('/signin').post(SignInUser)
router.route('/signout').post(SignOutUser)
router.route('/profile').post(verifyUserAuth,getUserDetails)
router.route('/profile/update').post(verifyUserAuth,updateUserProfile)
router.route('/admin/users').post(verifyUserAuth,roleBasedAccess("admin") ,getUserList)
router.route('/admin/user/:id').post(verifyUserAuth,roleBasedAccess("admin") ,getSingleUserList)
.put(verifyUserAuth,roleBasedAccess("admin") ,ChangingUserRole)
.delete(verifyUserAuth,roleBasedAccess("admin") ,deletingUser)
export default router