import asyncErrors from "../MiddleWare/asyncErrors.js"
import User from '../Models/userModel.js'
import handleError from "../utils/handleError.js";
import { sendTokens } from "../utils/jwt.js";
import crypto from 'crypto'

export const SignUpUser = asyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    })
    sendTokens(user, 201, res)
})

//SignIn
export const SignInUser = asyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new handleError("Email And Password Cannot Be Empty", 402));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new handleError("Invalid Email And Password", 401))
    }
    const isPassValid = await user.passVerification(password);
    if (!isPassValid) {
        return next(new handleError("Invalid Email And Password", 401));
    }
    sendTokens(user, 200, res)
})

//SignOut
export const SignOutUser = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
    })
    res.status(200).json({
        success: true,
        message: "Successfully Signed Out"
    })
}

// Getting User Details
export const getUserDetails = asyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//Update User Profile
export const updateUserProfile = asyncErrors(async (req, res, next) => {
    const { name, email } = req.body;
    const updateUserDetails = {
        name,
        email
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user

    })

})

//Admin Getting user Information
export const getUserList = asyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

//Admin Getting Single User Information
export const getSingleUserList = asyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new handleError(`User does't exist with this id:${req.params.id}`, 400))
    }
    res.status(200).json({
        success: true,
        user
    })

})

//Admin Changing User Role
export const ChangingUserRole = asyncErrors(async (req, res, next) => {
    const { role } = req.body;
    const newUserData = {
        role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })
    if (!user) {
        return next(new handleError("User doesn't exist", 400))
    }
    res.status(200).json({
        success: true,
        user
    })

})

//Admin Delete User
export const deletingUser = asyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new handleError("User doesn't exist", 400))
    }
    // Prevent deleting admin
    if (user.role === "admin") {
        return next(new handleError("Admin user cannot be deleted", 403));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",

    })
})

 



