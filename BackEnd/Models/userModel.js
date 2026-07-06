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
);