import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";


dotenv.config({ path: "BackEnd/config/config.env" });

const mysqlConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DB_NAME || "homebuzz",
};

const createMySQLDatabaseAndSchema = async () => {
    const connection = await mysql.createConnection({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\``);
        await connection.query(`USE \`${mysqlConfig.database}\``);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'seller', 'admin') DEFAULT 'user',
                profile_pic_id VARCHAR(255) DEFAULT 'profile id',
                profile_pic_url VARCHAR(255) DEFAULT 'profile url',
                store_name VARCHAR(255) DEFAULT NULL,
                store_description TEXT DEFAULT NULL,
                phone VARCHAR(50) DEFAULT NULL,
                alt_phone VARCHAR(50) DEFAULT NULL,
                address TEXT DEFAULT NULL,
                seller_status ENUM('none', 'pending', 'approved', 'rejected') DEFAULT 'none',
                reset_password_token VARCHAR(255) DEFAULT NULL,
                reset_password_expire BIGINT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log(`🗄️ MySQL database '${mysqlConfig.database}' and users table are ready.`);
    } finally {
        await connection.end();
    }
};

export const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`🍃 MongoDB is connected to server: ${data.connection.host}`);
        return data;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

await createMySQLDatabaseAndSchema();

const pool = mysql.createPool({
    ...mysqlConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const mysqlPool = pool;