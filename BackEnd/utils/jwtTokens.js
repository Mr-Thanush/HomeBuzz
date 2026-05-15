export const sendTokens=(user,statusCode,res)=>{
  const token=user.getJWTtoken();

  const options={
    expires:new Date(Date.now()+process.env.EXPIRES_COOKIE*24*60*60*1000),
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }

  res.status(statusCode)
  .cookie("token",token,options)
  .json({
     success:true, 
        user,
        token  
  })
}
