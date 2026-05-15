import handleError from "../utils/handleError.js";

export default (err,req,res,next)=>{
   err.statusCode=err.statusCode||500;
   err.message=err.message||"Internal Server Error"

//CastError
   if(err.name==="CastError"){
      const message=`This In Valid Resource ${err.path}`;
      err=new handleError(message,404)    
   }

// duplicate key errors
if(err.code===11000){
    const message=`This ${Object.keys(err.keyValue)} Is Already Exists,Please Login To Continue`;
    err=new handleError(message,400)  
}



   res.status(err.statusCode).json({
    success:false,
    message:err.message
   })

}