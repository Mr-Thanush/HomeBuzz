import dotenv from "dotenv";
if(process.env.NODE_ENV!=="Production"){
    dotenv.config({path: "BackEnd/config/config.env"});
}

import app from "./app.js"
import { connectDB } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

connectDB();
//uncaughted Exceprtion Errors
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Server is Shutting Down Due To Uncaughted Exceprtion Errors`);

    process.exit(1);
    
    });

const port=process.env.PORT||8080;

const server=app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})

//UnHandle Promise Rejections Errors
process.on('unhandledRejection',(err)=>{
   console.log(`Error: ${err.message}`);
   console.log(`Server Is Shutting Down Due To UnHandle Promise Rejections`); 
   server.close(()=>{
    process.exit(1);  
   });
})


