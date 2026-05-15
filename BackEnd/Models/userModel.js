import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [25, "Invalid Name. Please Enter a Name With Fewer Than 25 Characters"],
        minLength: [3, "Name Should Contain More Than 3 Characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your PassWord"],
        minLength: [7, "PassWord Should Contain More Than 7 Characters"],
        select: false
    },
    profilepic: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

//password hashing
userSchema.pre("save", async function () {

    //if it was hashed why need to hash again
    if (!this.isModified("password")) {
        return ;
    }
    this.password = await bcryptjs.hash(this.password, 10);

});


//jwt tokens
userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

//password validation
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
    return bcryptjs.compare(String(userEnteredPassword), this.password)
}

// Reset Token For password reset
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;  //5 min

    return resetToken;
}
export default mongoose.model("User", userSchema);