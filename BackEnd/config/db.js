import mongoose from "mongoose";

export const connectDB=()=>{
    mongoose.connect(process.env.DB_URL)
.then((data)=>{
   console.log(`DataBase is connected to server ${data.connection.host}`);
   })
}