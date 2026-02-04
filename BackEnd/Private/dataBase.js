import mongoose from "mongoose";

export const connectionDB=()=>{
    mongoose.connect(process.env.DATABASE_URI).then((data)=>{
    console.log(`MongoDb is connected to server ${data.connection.host}`);
    
})
}


