import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`Database is connected to server ${data.connection.host}`);
        return data;
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
};