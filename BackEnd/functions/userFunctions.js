import asyncErrors from "../MiddleWare/asyncErrors.js"
import User from '../Models/userModel.js'
import handleError from "../utils/handleError.js";
import { sendTokens } from "../utils/jwt.js";
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail.js";

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
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Successfully Signed Out"
    })
}

//Forgot Reset Password
export const requestPassReset = asyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new handleError("User doesn't exist", 400));
    }
    let resetToken;
    try {
        resetToken = user.generatePassResetToken()
        await user.save({ validateBeforeSave: false })

    } catch (error) {
        console.log(error)
        return next(new handleError("Could not save reset token, Please try again later", 500));

    }

    const resetPassURL = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPassURL} . \n\n This link will expire in 30min.\n\n
    If you didn't request a password reset,please ignore this message.`;
    try {
        //send Email
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.dave({ validateBeforeSave: false })
        return next(new handleError("Email could't be sent, Please try again later", 500))
    }
})

//Reset Password 
export const resetPass = asyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new handleError("Reset Password Token Is Invalid Or Has Been Expires", 400))
    }
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        return next(new handleError(" Password Does't Match", 400))
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokens(user, 200, res)
})

// Getting User Details
export const getUserDetails = asyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//Update PassWord
export const updatePass = asyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const checkPassMatch = await user.passVerification(oldPassword);
    if (!checkPassMatch) {
        return next(new handleError('Old Password Is Incorrect', 400))
    }
    if (newPassword !== confirmPassword) {
        return next(new handleError("Password does't match", 400))
    }
    user.password = newPassword;
    await user.save();
    sendTokens(user, 200, res);
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
    // ❌ Prevent deleting admin
    if (user.role === "admin") {
        return next(new handleError("Admin user cannot be deleted", 403));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",

    })
})

 



