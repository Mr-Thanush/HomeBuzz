import handleAsyncError from "../middleWare/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import { sendTokens } from "../utils/jwtTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import { mysqlPool } from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// Structural data mapper to preserve Mongoose-like output shapes for the front-end
const mapUserDoc = (row) => {
    if (!row) return null;
    return {
        _id: row.id, // Keeping _id alias for compatibility
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        profilepic: {
            public_id: row.profile_pic_id,
            url: row.profile_pic_url
        },
        sellerInfo: row.seller_status !== "none" ? {
            storeName: row.store_name,
            description: row.store_description,
            phone: row.phone,
            altPhone: row.alt_phone,
            address: row.address,
            status: row.seller_status
        } : undefined,
        createdAt: row.created_at
    };
};

// Register User
export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new handleError("All Fields Are Required", 400));
    }

    const [existing] = await mysqlPool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
        return next(new handleError("User Already Exists", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await mysqlPool.query(
        `INSERT INTO users (name, email, password, profile_pic_id, profile_pic_url) VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, "profile id", "profile url"]
    );

    const user = {
        _id: result.insertId,
        id: result.insertId,
        name,
        email,
        role: "user",
        profilepic: { public_id: "profile id", url: "profile url" }
    };

    sendTokens(user, 201, res);
});

// Login User
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new handleError("Email and Password Cannot Be Empty", 400));
    }

    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
        return next(new handleError("Invalid Email or Password", 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new handleError("Invalid Email or Password", 400));
    }

    sendTokens(mapUserDoc(user), 200, res);
});

// Logout User
export const logoutUser = handleAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Successfully Logged Out"
    });
});

// Forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
        return next(new handleError("User Doesn't Exist", 400));
    }

    const rawResetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
    const resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    await mysqlPool.query(
        "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?",
        [resetPasswordToken, resetPasswordExpire, user.id]
    );

    const frontendUrl = process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
    const resetPasswordUrl = `${frontendUrl}/reset/${rawResetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordUrl}.\n\nThis link will expire in 5 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email was sent to ${user.email} successfully`
        });
    } catch (error) {
        await mysqlPool.query("UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?", [user.id]);
        return next(new handleError("Email could not be sent. Please try again later.", 500));
    }
});

// Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
    const [rows] = await mysqlPool.query(
        "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expire > ?",
        [resetPasswordToken, Date.now()]
    );
    const user = rows[0];

    if (!user) {
        return next(new handleError("Reset password token is invalid or has expired", 401));
    }

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new handleError("Passwords do not match", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await mysqlPool.query(
        "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
        [hashedPassword, user.id]
    );

    const [updatedUser] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [user.id]);
    sendTokens(mapUserDoc(updatedUser[0]), 200, res);
});

// Get User Details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return next(new handleError("User not found", 404));

    res.status(200).json({
        success: true,
        user: mapUserDoc(rows[0])
    });
});

// Update Password
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    const user = rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new handleError("Old Password Is Incorrect", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new handleError("Passwords do not match", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await mysqlPool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);
    
    const [updatedUser] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    sendTokens(mapUserDoc(updatedUser[0]), 200, res);
});

// Update User Details
export const updateUserDetails = handleAsyncError(async (req, res, next) => {
    const { name, email, profilepic } = req.body;

    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    const user = rows[0];
    if (!user) return next(new handleError("User not found", 404));

    let picId = user.profile_pic_id;
    let picUrl = user.profile_pic_url;

    if (profilepic) {
        if (user.profile_pic_id && user.profile_pic_id !== "profile id") {
            await cloudinary.uploader.destroy(user.profile_pic_id);
        }

        const imageData = profilepic.includes("base64,") ? profilepic.split("base64,")[1] : profilepic;
        try {
            const myCloud = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageData}`, {
                folder: "HomeBuzz",
                width: 150,
                crop: "scale"
            });
            picId = myCloud.public_id;
            picUrl = myCloud.secure_url;
        } catch (uploadError) {
            return next(new handleError("Failed to upload image. Please try again.", 500));
        }
    }

    await mysqlPool.query(
        "UPDATE users SET name = ?, email = ?, profile_pic_id = ?, profile_pic_url = ? WHERE id = ?",
        [name, email, picId, picUrl, req.user.id]
    );

    const [updatedRows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user: mapUserDoc(updatedRows[0])
    });
});

// Admin Users List
export const adminUsersList = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users");
    res.status(200).json({
        success: true,
        users: rows.map(mapUserDoc)
    });
});

// Admin Single User
export const adminSingleUser = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
        return next(new handleError(`User Doesn't Exist With This Id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user: mapUserDoc(rows[0])
    });
});

// Admin Update User Role
export const adminUpdateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;
    if (!["user", "seller", "admin"].includes(role)) {
        return next(new handleError("Invalid role value", 400));
    }

    const [result] = await mysqlPool.query("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id]);
    if (result.affectedRows === 0) {
        return next(new handleError("User Does Not Exist", 400));
    }

    const [updatedRows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    res.status(200).json({
        success: true,
        user: mapUserDoc(updatedRows[0])
    });
});

// Admin Delete User
export const adminDeleteUser = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    const user = rows[0];

    if (!user) return next(new handleError("User Does Not Exist", 400));

    if (user.profile_pic_id && user.profile_pic_id !== "profile id") {
        await cloudinary.uploader.destroy(user.profile_pic_id);
    }

    await mysqlPool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});

// Become Seller
export const becomeSeller = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    const user = rows[0];
    if (!user) return next(new handleError("User not found", 404));

    if (user.role === "seller" || user.seller_status === "pending") {
        return next(new handleError("Seller status already initialized or active", 400));
    }

    await mysqlPool.query(
        `UPDATE users SET store_name = ?, store_description = ?, phone = ?, alt_phone = ?, address = ?, seller_status = 'pending' WHERE id = ?`,
        [req.body.name, req.body.description, req.body.phone, req.body.altPhone, req.body.address, req.user.id]
    );

    const [updatedUser] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    res.status(200).json({
        success: true,
        message: "Store created. Await admin approval.",
        user: mapUserDoc(updatedUser[0])
    });
});

// Get Pending Seller Requests
export const getSellerRequests = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE seller_status = 'pending'");
    res.status(200).json({
        success: true,
        requests: rows.map(mapUserDoc)
    });
});

// Approve Seller Request
export const approveSellerRequest = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    const user = rows[0];

    if (!user || user.seller_status !== "pending") {
        return next(new handleError("Valid pending seller request not found", 404));
    }

    await mysqlPool.query("UPDATE users SET role = 'seller', seller_status = 'approved' WHERE id = ?", [req.params.id]);
    const [updatedUser] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);

    res.status(200).json({
        success: true,
        message: "Seller request approved",
        user: mapUserDoc(updatedUser[0])
    });
});

// Reject Seller Request
export const rejectSellerRequest = handleAsyncError(async (req, res, next) => {
    const [rows] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    const user = rows[0];

    if (!user || user.seller_status !== "pending") {
        return next(new handleError("Valid pending seller request not found", 404));
    }

    await mysqlPool.query("UPDATE users SET role = 'user', seller_status = 'rejected' WHERE id = ?", [req.params.id]);
    const [updatedUser] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);

    res.status(200).json({
        success: true,
        message: "Seller request rejected",
        user: mapUserDoc(updatedUser[0])
    });
});