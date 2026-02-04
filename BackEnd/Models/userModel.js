import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [25, "Invalid name. Please enter a name with fewer than 25 character"],
        minLength: [3, "Name should contain more than 3 characters"]

    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]

    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minLength: [8, "Password should be greater than 8 character"],
        select: false
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    hasStore: {
  type: Boolean,
  default: false,
},

    resetPasswordToken: String,
    resetPasswordExpire: Date



}, { timestamps: true })

//Password Hashing
userSchema.pre("save", async function () {
    // If password is NOT modified, move on
    if (!this.isModified("password")) {
        return ;
    }

    // Hash ONLY when password changes
    this.password = await bcryptjs.hash(this.password, 10);
   
});
userSchema.methods.getJWTToken = function (){
    return jwt.sign({ id: this._id },process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.passVerification =async function(userEnteredPass){
    return await bcryptjs.compare(userEnteredPass,this.password);
}

//generate token
userSchema.methods.generatePassResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+30*60*1000 //30min
    return resetToken;

}

export default mongoose.model("User", userSchema)