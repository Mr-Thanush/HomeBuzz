import handleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode=err.statusCode||402;
    err.message=err.message||"Internal server Error";
    //Cast Error
    if(err.name==="CastError"){
        const message=`This is invalid resource ${err.path}`;
        err=new handleError(message,404)
    }

    // Duplicate Inputs
    if(err.code===11000){
        const message=`This ${Object.keys(err.keyValue)} already Exist`;
        err=new handleError(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}