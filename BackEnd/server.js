import app from './app.js'
import dotenv from 'dotenv'
import { connectionDB } from './Private/dataBase.js';
dotenv.config({path:'BackEnd/private/config.env'})
connectionDB();
// Handle uncought exception errors
process.on('uncaughtException',(err)=>{
     console.log(`Error:${err.message}`);
     console.log(`Server Is Shutting Down,Due To Uncought Exception Errors`);
     process.exit(1)
})

const port=process.env.PORT||8080;


const server=app.listen(port,()=>{
    console.log(`Server is Running on PORT ${port}`);
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Server Is Shutting Down,Due To Unhandled Promise Rejection`);
        server.close(()=>{
            process.exit(1)
        })
    
    
})

