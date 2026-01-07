-- =============================================
-- ANTALYA SHAWARMA - MySQL DATABASE SCHEMA
-- Version: 1.0.0
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS antalya_shawarma;
USE antalya_shawarma;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    age INT,
    address TEXT,
    profile_picture LONGTEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20),
    address TEXT,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card') DEFAULT 'cash',
    status ENUM('pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
    driver_id INT,
    rejection_reason TEXT,
    special_instructions TEXT,
    delivery_distance DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DRIVERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    secret_code VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255),
    deliveries INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_secret_code (secret_code),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MENU CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MENU ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    icon VARCHAR(10),
    image_url VARCHAR(500),
    options JSON,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    order_id VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- BANK SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bank_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_name VARCHAR(100),
    account_holder VARCHAR(150),
    account_number VARCHAR(20),
    sort_code VARCHAR(10),
    iban VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VERIFICATION CODES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    type ENUM('signup', 'login', 'password_reset') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_code (email, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- ADMIN/OWNER SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default categories
INSERT INTO categories (slug, name, icon, display_order) VALUES
('shawarma', 'Shawarma Wraps', '🌯', 1),
('portions_chips', 'Portions (Chips)', '🍟', 2),
('portions_rice', 'Portions (Rice)', '🍚', 3),
('grill', 'Grill Portions', '🍖', 4),
('platters', 'Family Platters', '🍽️', 5),
('rice', 'Rice & Biryani', '🍚', 6),
('chicken', 'Roasted Chicken', '🍗', 7),
('fatayer', 'Fatayer', '🥟', 8),
('pizza', 'Pizza', '🍕', 9),
('burgers', 'Burgers', '🍔', 10),
('meals', 'Meal Deals', '🎁', 11),
('sides', 'Sides & Extras', '🥗', 12),
('sauces', 'Sauces', '🧄', 13),
('drinks', 'Drinks', '🥤', 14);

-- Insert default drivers
INSERT INTO drivers (name, email, phone, secret_code, deliveries, rating) VALUES
('Mohammed Ali', 'mohammed@antalya.com', '+44 7700 900123', 'DRV-001-MA', 247, 4.9),
('Ahmed Hassan', 'ahmed@antalya.com', '+44 7700 900124', 'DRV-002-AH', 189, 4.8),
('Fatima Khan', 'fatima@antalya.com', '+44 7700 900125', 'DRV-003-FK', 156, 4.7);

-- Insert default bank settings
INSERT INTO bank_settings (bank_name, account_holder, account_number, sort_code) VALUES
('Barclays Bank UK', 'Antalya Shawarma Ltd', '12345678', '20-45-67');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('restaurant_name', 'Antalya Shawarma'),
('restaurant_address', '181 Market St, Hyde SK14 1HF'),
('restaurant_phone', '+44 121 293 0395'),
('restaurant_lat', '53.4514'),
('restaurant_lng', '-2.0839'),
('max_delivery_distance', '6'),
('free_delivery_distance', '1'),
('zone1_price', '3.99'),
('zone2_price', '5.99'),
('currency', '£'),
('owner_email', 'admin@antalyashawarma.com'),
('owner_password', 'admin2024'),
('owner_pin', '1234'),
('staff_email', 'staff@antalyashawarma.com'),
('staff_password', 'staff2024');

-- =============================================
-- SAMPLE MENU ITEMS (Shawarma category)
-- =============================================
INSERT INTO menu_items (category_id, name, description, price, icon, options) VALUES
(1, 'Chicken Shawarma Wrap', 'Tender marinated chicken with garlic sauce, salad & pickles in fresh naan', 6.99, '🌯', 
 '[{"name": "Extra Meat", "price": 2.00}, {"name": "Extra Garlic Sauce", "price": 0.50}, {"name": "Add Cheese", "price": 1.00}, {"name": "Add Hummus", "price": 1.00}, {"name": "Make it Spicy", "price": 0}]'),
(1, 'Lamb Shawarma Wrap', 'Juicy lamb shawarma with tahini sauce, fresh salad in naan bread', 7.99, '🌯',
 '[{"name": "Extra Meat", "price": 2.50}, {"name": "Extra Tahini", "price": 0.50}, {"name": "Add Cheese", "price": 1.00}, {"name": "Add Hummus", "price": 1.00}, {"name": "Make it Spicy", "price": 0}]'),
(1, 'Mixed Shawarma Wrap', 'Best of both - chicken & lamb shawarma combo with all sauces', 8.99, '🌯',
 '[{"name": "Extra Meat", "price": 3.00}, {"name": "Add Cheese", "price": 1.00}, {"name": "Extra Sauce", "price": 0.50}, {"name": "Add Hummus", "price": 1.00}]'),
(1, 'Falafel Wrap', 'Crispy homemade falafel with hummus, tahini and fresh salad', 5.99, '🧆',
 '[{"name": "Extra Falafel", "price": 1.50}, {"name": "Add Cheese", "price": 1.00}, {"name": "Extra Hummus", "price": 0.75}]');
