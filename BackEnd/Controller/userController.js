import { log } from "console";
import dotenv from "dotenv";
dotenv.config({path: "BackEnd/config/config.env"});
import handleAsyncError from "../middleWare/handleAsyncError.js";
import User from "../Models/userModel.js"
import handleError from "../utils/handleError.js";
import { sendTokens } from "../utils/jwtTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";


//Register User
export const registerUser=handleAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;

    //Validation 
    if(!name||!email||!password){
      return next(new handleError("All Fields Are Required",400))
    }

    //check user existing
    const existingUser=await User.findOne({email});
    if(existingUser){
        return next(new handleError("User Already Exists",400))
    }

    const user=await User.create({
        name,
        email,
        password,
        profilepic:{
            public_id:"profile id",
            url:"profile url"
        }
    });

    sendTokens(user,201,res);
});

//Login User
export const loginUser=handleAsyncError(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(new handleError(`Email and Password Cannot Be Empty`,400));
    };

    const user=await User.findOne({email}).select("+password")

    if(!user){
          return next(new handleError(`Invalid Email or Password `,400));
    }

    const isPasswordValid=await user.verifyPassword(password);

    if(!isPasswordValid){
        return next(new handleError(`Invalid Email or Password `,400));
    }

  
    sendTokens(user,200,res);

});

//Logout User
export const logoutUser=handleAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
      expires:new Date(Date.now()),
       httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Successfully Logged Out"
    })
    
})

// Forgot Password
export const requestPasswordReset=handleAsyncError(async (req,res,next)=>{
    const {email}=req.body;
    const user=await User.findOne({email});

    if(!user){
        return next(new handleError("User Does't Exists",400));
    }

    let resetToken;
    
    try {
        resetToken=user.generatePasswordResetToken();
        await user.save({validateBeforeSave:false})
        
        
    } catch (error) {
        return next(new handleError("Could Not Save Reset Token,Please Try Again Later",500));
    }

    const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset/${resetToken}`;
    const message=`Use Following Link To Reset Your Password: ${resetPasswordUrl}. \n\n This Link Will Expire In 5 Minutes.
    \n\n If You Don't Request a Password Request,Please Ignore This Message.`;
    try {
        //send email
        await sendEmail({
            email:user.email,
            subject:`Password Reset Request`,
            message
        })
        res.status(200).json({
            success:true,
            message:`Email Is Sent To ${user.email} Successfully`
        })
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new handleError("Email Could Not Be Sent , Please Try Again Later",500));
    }
})

//Reset Password
export const resetPassword=handleAsyncError(async(req,res,next)=>{
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
   const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()}
   })

   if(!user){
    return next(
        new handleError("Reset Password Token Is Invalid Or Has Been Expired",401)
    );
   }

   const {password,confirmPassword}=req.body;

   if(password!==confirmPassword){
    return next(new handleError("Password Does Not Match",400));
   }

   user.password=password;
   user.resetPasswordToken=undefined;
   user.resetPasswordExpire=undefined;
   await user.save()
   sendTokens(user,200,res);
})

//Get User Details
export const getUserDetails=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

//Update Password
export const updatePassword=handleAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;

    const user=await User.findById(req.user.id).select('+password');

    const checkPasswordMatch=await user.verifyPassword(oldPassword);

    
    if(!checkPasswordMatch){
        return next(new handleError("Old Password Is Incorrect",400));
    }

    if(newPassword!==confirmPassword){
        return next(new handleError("Password Does Not Match",400));
    }



    user.password=newPassword;
    await user.save();
    sendTokens(user,200,res);

})

//Update User Details
export const updateUserDetails=handleAsyncError(async(req,res,next)=>{
    const {name,email,profilepic}=req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
    return next(new handleError("User not found", 404));
  }

   const updateUserDetails={
        name,
        email
    }


    if(profilepic){

        // DELETE OLD IMAGE
    if (user.profilepic?.public_id&& user.profilepic.public_id !== "profile id") {
      await cloudinary.uploader.destroy(user.profilepic.public_id);
    }

    // Strip the data URL prefix if present
    const imageData = profilepic.includes('base64,') 
      ? profilepic.split('base64,')[1] 
      : profilepic;

    //UPLOAD NEW IMAGE
    try {
        const myCloud=await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageData}`, {
        folder:"HomeBuzz",
        width:150,
        crop:"scale"
    })
    console.log("Profile update request received");
    console.log("ProfilePic exists:", Boolean(profilepic));

    updateUserDetails.profilepic = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };
    } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(new handleError("Failed to upload image. Please try again.", 500));
    }
    }


    const UpdatedUser=await User.findByIdAndUpdate(req.user.id,updateUserDetails,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully",
        user:UpdatedUser
    })
})

//GET ALL USERS FOR ADMIN
export const adminUsersList=handleAsyncError(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})


//GET SINGLE USER DETAILS FOR ADMIN
export const adminSingleUser=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new handleError(`User Does't Exitst With This Id:${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//CHANGE USER ROLE BY ADMIN
export const adminUpdateUserRole=handleAsyncError(async(req,res,next)=>{
    const {role}=req.body;
    const newUserData={
        role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true
    })

    if(!user){
        return next(new handleError("User Does Not Exist",400))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//Deleting User By Admin
export const adminDeleteUser=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new handleError("User Does Not Exist",400));
    }

     if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
    
})


