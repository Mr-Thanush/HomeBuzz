export default (myError)=>(req,res,next)=>{
    Promise.resolve(myError(req,res,next)).catch(next)
}