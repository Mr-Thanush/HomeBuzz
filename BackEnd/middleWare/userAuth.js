import User from "../Models/userModel.js";
import handleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken"


export const verifyUserAuth=handleAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new handleError("Authentication Is Missing !Please Login To Access Resources",401))
    }

   const decodedData=jwt.verify(token,process.env.JWT_TOKEN);
   req.user=await User.findById(decodedData.id);

   next();
})

export const roleBasedAccess=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new handleError(`Role -${req.user.role} Is Not Allowed To Access This Resources`,403));
        }
        next();
    }
} 