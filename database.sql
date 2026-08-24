-- =========================================================
-- 🍕 PIZZA HOUSE QUETTA - COMPLETE MYSQL DATABASE DUMP & SCHEMA
-- Database Name: `pizza_house_quetta`
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB, phpMyAdmin, XAMPP, Laragon
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:00";

CREATE DATABASE IF NOT EXISTS `pizza_house_quetta` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `pizza_house_quetta`;

-- =========================================================
-- 1. Table: `admin_users`
-- =========================================================
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`username`, `password`, `role`) VALUES 
('admin', 'Dtan@1234', 'superadmin');

-- =========================================================
-- 2. Table: `store_settings`
-- =========================================================
DROP TABLE IF EXISTS `store_settings`;
CREATE TABLE `store_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `store_name` VARCHAR(100) NOT NULL,
  `tagline` VARCHAR(255) DEFAULT '',
  `address` TEXT NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `hours` VARCHAR(100) DEFAULT '',
  `is_open` TINYINT(1) DEFAULT 1,
  `tax_rate` DECIMAL(5,2) DEFAULT 15.00,
  `delivery_fee` DECIMAL(10,2) DEFAULT 100.00,
  `free_delivery_threshold` DECIMAL(10,2) DEFAULT 1500.00,
  `announcement_text` TEXT,
  `announcement_active` TINYINT(1) DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `store_settings` (
  `id`, `store_name`, `tagline`, `address`, `phone`, `hours`, 
  `is_open`, `tax_rate`, `delivery_fee`, `free_delivery_threshold`, 
  `announcement_text`, `announcement_active`
) VALUES (
  1,
  'Pizza House Quetta',
  'Quetta\'s Favorite Slice Since Day One',
  'Toghi Road, Quetta, Balochistan, Pakistan',
  '0300-1234567',
  'Daily, 10:00 AM – 12:00 AM',
  1,
  15.00,
  100.00,
  1500.00,
  '🔥 Midnight Craving Special: Free Delivery on orders above Rs. 1500! Call 0300-1234567',
  1
);

-- =========================================================
-- 3. Table: `categories`
-- =========================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) DEFAULT 'Utensils',
  `description` TEXT,
  `sort_order` INT DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `icon`, `description`, `sort_order`, `is_available`) VALUES
('pizza', 'Pizza', 'Pizza', 'Hand-tossed crust with gourmet toppings & 100% real mozzarella cheese', 1, 1),
('burgers', 'Burgers', 'Beef', 'Juicy grilled & golden crispy fried burgers packed with flavor', 2, 1),
('shawarma', 'Shawarma', 'Utensils', 'Authentic Middle Eastern shawarma wraps smothered in garlic sauce', 3, 1),
('rolls', 'Chicken Rolls', 'Wrap', 'Golden paratha rolls filled with tender chicken tikka & spicy mayo', 4, 1),
('pasta', 'Pasta', 'CookingPot', 'Rich cheesy oven-baked pasta bowls with garlic white & red sauce', 5, 1),
('crispy', 'Crispy Items', 'Drumstick', 'Golden crispy deep-fried broast, chicken wings, nuggets & hot shots', 6, 1),
('fries', 'Fries', 'Fries', 'Crispy seasoned golden french fries & cheese-loaded pizza fries', 7, 1),
('sweet', 'SWEET', 'Utensils', 'Desserts and sweets', 8, 1);

-- =========================================================
-- 4. Table: `menu_items`
-- =========================================================
DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `image` TEXT,
  `is_bestseller` TINYINT(1) DEFAULT 0,
  `is_popular` TINYINT(1) DEFAULT 0,
  `is_spicy` TINYINT(1) DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `prep_time` VARCHAR(50) DEFAULT '15-20 min',
  `sizes_json` JSON DEFAULT NULL,
  `addons_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `menu_items` (
  `id`, `name`, `slug`, `category_id`, `price`, `description`, `image`, 
  `is_bestseller`, `is_popular`, `is_spicy`, `is_available`, `rating`, `prep_time`, 
  `sizes_json`, `addons_json`, `created_at`
) VALUES
('p-1', 'Chicken Tikka Pizza', 'chicken-tikka-pizza', 'pizza', 605.00, 'Chicken tikka, onion, cheddar, mozzarella, green pepper & pizza sauce', '/images/tikka_pizza.jpg', 1, 1, 1, 1, 4.90, '15-20 min', '[{"name":"Small 9\\"","priceOffset":0},{"name":"Medium 11\\"","priceOffset":300},{"name":"Large 13\\"","priceOffset":600},{"name":"Jumbo 15\\"","priceOffset":900}]', '[{"id":"extra-cheese","name":"Extra Mozzarella Cheese","price":150},{"id":"garlic-dip","name":"Signature Garlic Mayo Dip","price":80},{"id":"jalapenos","name":"Extra Spicy Jalapeños","price":60}]', '2026-08-12 01:00:00'),
('p-2', 'Chicken Fajita Pizza', 'chicken-fajita-pizza', 'pizza', 605.00, 'Spicy chicken, fried vegetables, tomato, cheddar, mozzarella & pizza sauce', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.80, '15-20 min', '[{"name":"Small 9\\"","priceOffset":0},{"name":"Medium 11\\"","priceOffset":300},{"name":"Large 13\\"","priceOffset":600}]', '[{"id":"extra-cheese","name":"Extra Mozzarella Cheese","price":150},{"id":"garlic-dip","name":"Signature Garlic Mayo Dip","price":80}]', '2026-08-12 01:00:00'),
('p-3', 'Hot & Spicy Pizza', 'hot-and-spicy-pizza', 'pizza', 660.00, 'Spicy roasted chicken, green chillies, red peppers, onions & hot chili sauce', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop', 0, 0, 1, 1, 4.70, '15-20 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-4', 'Chicken Supreme Pizza', 'chicken-supreme-pizza', 'pizza', 715.00, 'Combination of chicken tikka, fajita chicken, black olives, mushrooms, onions & bell peppers', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.80, '18-22 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-5', 'Hot Kababish Pizza', 'hot-kababish-pizza', 'pizza', 770.00, 'Juicy chicken kabab chunks, green chillies, diced onions, cheese & specialty sauce', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop', 0, 0, 1, 1, 4.60, '18-22 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-6', 'Chicken Blast Pizza', 'chicken-blast-pizza', 'pizza', 770.00, 'Blast of seasoned chicken chunks, extra double layer mozzarella cheese & white garlic drizzle', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.70, '20 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-7', 'Chicken Pepperoni Pizza', 'chicken-pepperoni-pizza', 'pizza', 825.00, 'Generous cured chicken pepperoni slices over rich tomato basil sauce & golden mozzarella', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.90, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-8', '4 Flavour Pizza', '4-flavour-pizza', 'pizza', 825.00, '4 delicious quadrants featuring Tikka, Fajita, Supreme & Pepperoni in one grand pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.90, '20 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-9', 'Special Stuff Pizza', 'special-stuff-pizza', 'pizza', 825.00, 'Golden stuffed crust loaded with cheese, sausages, special chicken & secret sauce', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.80, '22 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-10', 'Crown Crust Pizza', 'crown-crust-pizza', 'pizza', 880.00, 'Royal crown-shaped crust filled with melted cheesy kabab nuggets & loaded chicken center', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 5.00, '25 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-11', 'Cheese Lave Pizza', 'cheese-lave-pizza', 'pizza', 880.00, 'Overflowing molten cheese lava volcano center with spicy chicken tikka & herbs', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop', 1, 1, 1, 1, 4.90, '25 min', NULL, NULL, '2026-08-12 01:00:00'),
('p-12', 'Calzone Pizza', 'calzone-pizza', 'pizza', 880.00, 'Traditional folded Italian calzone pocket packed with spicy chicken, mozzarella & garlic butter', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.70, '20 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-1', 'Chicken Burger', 'chicken-burger', 'burgers', 302.50, 'Juicy grilled chicken patty with fresh lettuce, mayo & house seasoning in toasted bun', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.60, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-2', 'Beef Burger', 'beef-burger', 'burgers', 302.50, 'Flame-grilled juicy beef patty topped with melted cheddar, pickles & special burger sauce', 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.70, '12 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-3', 'Zinger Burger', 'zinger-burger', 'burgers', 385.00, 'Signature crispy golden zinger chicken fillet with fresh coleslaw & spicy red sauce', '/images/zinger_burger.jpg', 1, 1, 1, 1, 4.90, '12 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-4', 'Krunch Burger', 'krunch-burger', 'burgers', 330.00, 'Extra crunchy fried chicken fillet with crisp iceberg lettuce & smooth garlic mayo', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.80, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-5', 'Double Decker Burger', 'double-decker-burger', 'burgers', 495.00, 'Double crispy chicken patties, double cheese slices, pickles & smoked mayo sauce', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.80, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-6', 'Special Burger', 'special-burger', 'burgers', 550.00, 'Special chicken patty, fried egg, double cheese, crispy onion rings & house glaze', 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.70, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-7', 'Pizza Burger', 'pizza-burger', 'burgers', 550.00, 'Burger patty topped with melted mozzarella, pepperoni slices & savory pizza marinara', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.80, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('b-8', 'Triple Floor Burger', 'triple-floor-burger', 'burgers', 605.00, '3-story tower burger stacked with 3 patties, triple cheese & spicy jalapeño relish', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop', 0, 0, 1, 1, 4.90, '18 min', NULL, NULL, '2026-08-12 01:00:00'),
('s-1', 'Chicken Shawarma', 'chicken-shawarma', 'shawarma', 220.00, 'Slow-roasted shaved chicken tikka with garlic sauce & tangy pickles wrapped in warm pita', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.70, '8 min', NULL, NULL, '2026-08-12 01:00:00'),
('s-2', 'Zinger Shawarma', 'zinger-shawarma', 'shawarma', 247.50, 'Crispy fried zinger strips wrapped in soft pita bread with spicy chilli mayo sauce', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop', 0, 1, 1, 1, 4.80, '8 min', NULL, NULL, '2026-08-12 01:00:00'),
('s-3', 'Creamy Shawarma', 'creamy-shawarma', 'shawarma', 247.50, 'Rich & creamy garlic chicken shawarma loaded with extra white cream sauce', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.70, '8 min', NULL, NULL, '2026-08-12 01:00:00'),
('s-4', 'Jumbo Shawarma', 'jumbo-shawarma', 'shawarma', 275.00, 'Extra large jumbo shawarma with double chicken portion, melted cheese & extra sauce', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.90, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('r-1', 'Chicken Roll', 'chicken-roll', 'rolls', 247.50, 'Crispy golden paratha roll filled with spiced chicken tikka boti & mint chutney', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.80, '8 min', NULL, NULL, '2026-08-12 01:00:00'),
('r-2', 'Zinger Roll', 'zinger-roll', 'rolls', 275.00, 'Crispy zinger chicken strips rolled inside golden layered crispy paratha', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800&auto=format&fit=crop', 0, 1, 1, 1, 4.70, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('r-3', 'Mayo Roll', 'mayo-roll', 'rolls', 275.00, 'Tender grilled chicken chunks drenched in velvety rich garlic mayo inside fresh paratha', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.60, '8 min', NULL, NULL, '2026-08-12 01:00:00'),
('r-4', 'Reshmi Roll', 'reshmi-roll', 'rolls', 330.00, 'Melt-in-mouth chicken reshmi kabab boti wrapped with golden fried onions & spiced chutney', 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.80, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('r-5', 'Special Roll', 'special-roll', 'rolls', 330.00, 'Signature loaded roll packed with double chicken boti, cheese slice & chef\'s special secret sauce', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.90, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('pa-1', 'Cheese Pasta', 'cheese-pasta', 'pasta', 687.50, 'Penne pasta tossed in garlic white sauce, chicken chunks & baked under a blanket of mozzarella', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.80, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('pa-2', 'Special Pasta', 'special-pasta', 'pasta', 715.00, 'Oven-baked pasta loaded with spicy chicken, black olives, mushrooms, peppers & golden cheese crust', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?q=80&w=800&auto=format&fit=crop', 0, 1, 1, 1, 4.90, '18 min', NULL, NULL, '2026-08-12 01:00:00'),
('c-1', 'Broast', 'broast', 'crispy', 500.00, '2 pieces crispy fried chicken broast served with golden french fries, bun & garlic mayo dip', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop', 1, 1, 0, 1, 4.80, '15 min', NULL, NULL, '2026-08-12 01:00:00'),
('c-2', 'Chicken Piece', 'chicken-piece', 'crispy', 400.00, 'Golden crispy deep-fried chicken piece seasoned with signature herbs & spices', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=800&auto=format&fit=crop', 0, 0, 0, 1, 4.60, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('c-3', 'Crispy Nuggets', 'crispy-nuggets', 'crispy', 500.00, '8 pieces of tender golden chicken nuggets served with honey mustard dip sauce', 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.70, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('c-4', 'Crispy Hot Wings 10pcs', 'crispy-hot-wings-10pcs', 'crispy', 500.00, '10 pieces of crispy hot chicken wings coated in signature spicy red seasoning', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop', 1, 1, 1, 1, 4.90, '12 min', NULL, NULL, '2026-08-12 01:00:00'),
('c-5', 'Hot Shots 10pcs', 'hot-shots-10pcs', 'crispy', 500.00, '10 bite-sized crunchy chicken hot shots fried to perfection with zesty dip', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=800&auto=format&fit=crop', 0, 0, 1, 1, 4.70, '10 min', NULL, NULL, '2026-08-12 01:00:00'),
('f-1', 'French Fries', 'french-fries', 'fries', 150.00, 'Crispy seasoned golden french fries served with ketchup', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop', 0, 1, 0, 1, 4.60, '5 min', NULL, NULL, '2026-08-12 01:00:00'),
('f-2', 'Pizza Fries', 'pizza-fries', 'fries', 500.00, 'Loaded french fries smothered in rich pizza sauce, melted mozzarella cheese, chicken tikka & jalapeños', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800&auto=format&fit=crop', 1, 1, 1, 1, 4.90, '10 min', NULL, NULL, '2026-08-12 01:00:00');

-- =========================================================
-- 5. Table: `orders`
-- =========================================================
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_email` VARCHAR(100) DEFAULT NULL,
  `order_type` ENUM('delivery', 'pickup') DEFAULT 'delivery',
  `address` TEXT,
  `landmark` VARCHAR(255) DEFAULT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'cod',
  `payment_status` ENUM('pending', 'paid', 'completed', 'failed') DEFAULT 'pending',
  `order_status` ENUM('Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 6. Table: `order_items`
-- =========================================================
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `item_id` VARCHAR(50),
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selected_size` VARCHAR(100) DEFAULT NULL,
  `selected_addons` JSON DEFAULT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (
  `id`, `order_number`, `customer_name`, `customer_phone`, `customer_email`, 
  `order_type`, `address`, `landmark`, `payment_method`, `payment_status`, 
  `order_status`, `subtotal`, `tax`, `delivery_fee`, `discount`, `total`, `notes`, `created_at`
) VALUES
('ord-1787583367858', 'PHQ-1009', 'moiez waheed', '03337838396', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, ', '', 'cod', 'paid', 'Delivered', 2055.00, 308.25, 0.00, 0.00, 2363.25, '', '2026-08-24 14:56:07'),
('ord-1787039938419', 'PHQ-1008', 'warda baloch bukhari ', '0333789865', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, Near Serena Chowk, Quetta', 'jani town near it university quetta ', 'card', 'pending', 'Out for Delivery', 1925.00, 288.75, 0.00, 0.00, 2213.75, 'extra spicy major mayo should be very hot and chessy and cold drinks should be added', '2026-08-18 07:58:58'),
('ord-1787039629804', 'PHQ-1007', 'jh', '568', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, Near Serena Chowk, Quetta', '', 'cod', 'pending', 'Preparing', 605.00, 90.75, 100.00, 0.00, 795.75, '', '2026-08-18 07:53:49'),
('ord-1786570768298', 'PHQ-1006', 'moiez waheed', '03133331411', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, Near Serena Chowk, Quetta', '', 'cod', 'paid', 'Delivered', 605.00, 90.75, 100.00, 0.00, 795.75, '', '2026-08-12 21:39:28'),
('ord-1786529948925', 'PHQ-1005', 'test', 'test', 'waheedmoiez1@gmail.com', 'delivery', 'test', 'test', 'jazzcash', 'paid', 'Delivered', 385.00, 57.75, 100.00, 0.00, 542.75, 'test', '2026-08-12 10:19:08'),
('ord-1786529896998', 'PHQ-1004', 'haji sanaullah ', '03133331411', 'waheedmoiez1@gmail.com', 'delivery', 'haji bahadur khan road ', '', 'cod', 'pending', 'Pending', 2570.00, 346.95, 0.00, 257.00, 2659.95, '', '2026-08-12 10:18:16'),
('ord-1786517382977', 'PHQ-1003', 'moiez waheed', '03133331411', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, Near Serena Chowk, Quetta', '', 'cod', 'pending', 'Pending', 825.00, 123.75, 100.00, 0.00, 1048.75, '', '2026-08-12 06:49:42'),
('ord-1786489158063', 'PHQ-1002', 'moiez waheed', '03133331411', 'waheedmoiez1@gmail.com', 'delivery', 'Toghi Road, Near Serena Chowk, Quetta', '', 'cod', 'pending', 'Pending', 605.00, 90.75, 100.00, 0.00, 795.75, '', '2026-08-11 22:59:18');

INSERT INTO `order_items` (`order_id`, `item_id`, `name`, `price`, `quantity`, `selected_size`, `selected_addons`, `total_price`) VALUES
('ord-1787583367858', 'p-2', 'Chicken Fajita Pizza', 835.00, 2, 'Small 9"', '["Extra Mozzarella Cheese", "Signature Garlic Mayo Dip"]', 1670.00),
('ord-1787583367858', 'b-3', 'Zinger Burger', 385.00, 1, NULL, NULL, 385.00),
('ord-1787039938419', 'p-1', 'Chicken Tikka Pizza', 605.00, 1, NULL, NULL, 605.00),
('ord-1787039938419', 'p-2', 'Chicken Fajita Pizza', 605.00, 1, NULL, NULL, 605.00),
('ord-1787039938419', 'p-4', 'Chicken Supreme Pizza', 715.00, 1, NULL, NULL, 715.00),
('ord-1787039629804', 'p-2', 'Chicken Fajita Pizza', 605.00, 1, NULL, NULL, 605.00),
('ord-1786570768298', 'p-2', 'Chicken Fajita Pizza', 605.00, 1, NULL, NULL, 605.00),
('ord-1786529948925', 'b-3', 'Crispy Zinger Burger', 385.00, 1, NULL, NULL, 385.00),
('ord-1786529896998', 'p-1', 'Chicken Tikka Pizza', 1285.00, 2, 'Large 13"', '["Signature Garlic Mayo Dip"]', 2570.00),
('ord-1786517382977', 'p-7', 'Chicken Pepperoni Pizza', 825.00, 1, NULL, NULL, 825.00),
('ord-1786489158063', 'p-1', 'Chicken Tikka Pizza', 605.00, 1, NULL, NULL, 605.00);

-- =========================================================
-- 7. Table: `reviews`
-- =========================================================
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) DEFAULT '',
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `item_ordered` VARCHAR(150) DEFAULT '',
  `date` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` (`id`, `name`, `location`, `rating`, `comment`, `item_ordered`, `date`, `created_at`) VALUES
('rev-1786489298265', 'Moiez', 'Alamdar Road', 5, 'Best pizza in Quetta, fast delivery and hot cheesy crust!', 'Chicken Tikka Pizza', 'Just now', '2026-08-11 23:01:38');

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- End of SQL Export for Pizza House Quetta
-- =========================================================
