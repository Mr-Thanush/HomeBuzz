import jwt from "jsonwebtoken";

export const sendTokens = (user, statusCode, res) => {
  // FIX: Generating the token directly since 'user' is now a plain MySQL row object
  const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE || "3d",
  });

  const cookieExpiryDays = Number(process.env.EXPIRES_COOKIE) || 3;
  const options = {
    expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true, 
      user,
      token  
    });
};