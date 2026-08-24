const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(rawData);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (typeof str === 'number') return str.toString();
  return "'" + String(str).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  }) + "'";
}

let sql = `-- =========================================================
-- Pizza House Quetta - MySQL Database Schema & Seed Data
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB, phpMyAdmin
-- Generated automatically from data/db.json
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:00";

CREATE DATABASE IF NOT EXISTS \`pizza_house_quetta\` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE \`pizza_house_quetta\`;

-- =========================================================
-- 1. Table: admin_users
-- =========================================================
DROP TABLE IF EXISTS \`admin_users\`;
CREATE TABLE \`admin_users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(20) DEFAULT 'admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`admin_users\` (\`username\`, \`password\`, \`role\`) VALUES 
(${escapeSql(data.admin?.username || 'admin')}, ${escapeSql(data.admin?.password || 'Dtan@1234')}, 'superadmin');

-- =========================================================
-- 2. Table: store_settings
-- =========================================================
DROP TABLE IF EXISTS \`store_settings\`;
CREATE TABLE \`store_settings\` (
  \`id\` INT PRIMARY KEY DEFAULT 1,
  \`store_name\` VARCHAR(100) NOT NULL,
  \`tagline\` VARCHAR(255) DEFAULT '',
  \`address\` TEXT NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`hours\` VARCHAR(100) DEFAULT '',
  \`is_open\` TINYINT(1) DEFAULT 1,
  \`tax_rate\` DECIMAL(5,2) DEFAULT 0.00,
  \`delivery_fee\` DECIMAL(10,2) DEFAULT 0.00,
  \`free_delivery_threshold\` DECIMAL(10,2) DEFAULT 0.00,
  \`announcement_text\` TEXT,
  \`announcement_active\` TINYINT(1) DEFAULT 1,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`store_settings\` (
  \`id\`, \`store_name\`, \`tagline\`, \`address\`, \`phone\`, \`hours\`, 
  \`is_open\`, \`tax_rate\`, \`delivery_fee\`, \`free_delivery_threshold\`, 
  \`announcement_text\`, \`announcement_active\`
) VALUES (
  1,
  ${escapeSql(data.settings.storeName)},
  ${escapeSql(data.settings.tagline)},
  ${escapeSql(data.settings.address)},
  ${escapeSql(data.settings.phone)},
  ${escapeSql(data.settings.hours)},
  ${data.settings.isOpen ? 1 : 0},
  ${data.settings.taxRate || 0},
  ${data.settings.deliveryFee || 0},
  ${data.settings.freeDeliveryThreshold || 0},
  ${escapeSql(data.settings.announcementText)},
  ${data.settings.announcementActive ? 1 : 0}
);

-- =========================================================
-- 3. Table: categories
-- =========================================================
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`icon\` VARCHAR(50) DEFAULT 'Utensils',
  \`description\` TEXT,
  \`sort_order\` INT DEFAULT 0,
  \`is_available\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (data.categories && data.categories.length > 0) {
  sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`icon\`, \`description\`, \`sort_order\`, \`is_available\`) VALUES\n`;
  const catRows = data.categories.map(c => 
    `  (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.icon || 'Utensils')}, ${escapeSql(c.description || '')}, ${c.sortOrder || 0}, ${c.isAvailable !== false ? 1 : 0})`
  );
  sql += catRows.join(',\n') + ';\n\n';
}

sql += `-- =========================================================
-- 4. Table: menu_items
-- =========================================================
DROP TABLE IF EXISTS \`menu_items\`;
CREATE TABLE \`menu_items\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL,
  \`category_id\` VARCHAR(50) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`description\` TEXT,
  \`image\` TEXT,
  \`is_bestseller\` TINYINT(1) DEFAULT 0,
  \`is_popular\` TINYINT(1) DEFAULT 0,
  \`is_spicy\` TINYINT(1) DEFAULT 0,
  \`is_available\` TINYINT(1) DEFAULT 1,
  \`rating\` DECIMAL(3,2) DEFAULT 5.00,
  \`prep_time\` VARCHAR(50) DEFAULT '15-20 min',
  \`sizes_json\` JSON DEFAULT NULL,
  \`addons_json\` JSON DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (data.items && data.items.length > 0) {
  sql += `INSERT INTO \`menu_items\` (
  \`id\`, \`name\`, \`slug\`, \`category_id\`, \`price\`, \`description\`, \`image\`, 
  \`is_bestseller\`, \`is_popular\`, \`is_spicy\`, \`is_available\`, \`rating\`, \`prep_time\`, 
  \`sizes_json\`, \`addons_json\`, \`created_at\`
) VALUES\n`;

  const itemRows = data.items.map(item => {
    const sizes = item.sizes ? JSON.stringify(item.sizes) : null;
    const addons = item.addOns ? JSON.stringify(item.addOns) : null;
    const createdAt = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

    return `  (${escapeSql(item.id)}, ${escapeSql(item.name)}, ${escapeSql(item.slug || item.id)}, ${escapeSql(item.categoryId)}, ${item.price || 0}, ${escapeSql(item.description || '')}, ${escapeSql(item.image || '')}, ${item.isBestseller ? 1 : 0}, ${item.isPopular ? 1 : 0}, ${item.isSpicy ? 1 : 0}, ${item.isAvailable !== false ? 1 : 0}, ${item.rating || 5.0}, ${escapeSql(item.prepTime || '15-20 min')}, ${sizes ? escapeSql(sizes) : 'NULL'}, ${addons ? escapeSql(addons) : 'NULL'}, ${escapeSql(createdAt)})`;
  });

  sql += itemRows.join(',\n') + ';\n\n';
}

sql += `-- =========================================================
-- 5. Table: orders
-- =========================================================
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`customer_name\` VARCHAR(100) NOT NULL,
  \`customer_phone\` VARCHAR(50) NOT NULL,
  \`customer_email\` VARCHAR(100) DEFAULT NULL,
  \`order_type\` ENUM('delivery', 'pickup') DEFAULT 'delivery',
  \`address\` TEXT,
  \`landmark\` VARCHAR(255) DEFAULT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'cod',
  \`payment_status\` ENUM('pending', 'paid', 'completed', 'failed') DEFAULT 'pending',
  \`order_status\` ENUM('Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  \`subtotal\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`tax\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`delivery_fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`notes\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 6. Table: order_items
-- =========================================================
DROP TABLE IF EXISTS \`order_items\`;
CREATE TABLE \`order_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` VARCHAR(50) NOT NULL,
  \`item_id\` VARCHAR(50),
  \`name\` VARCHAR(150) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`selected_size\` VARCHAR(100) DEFAULT NULL,
  \`selected_addons\` JSON DEFAULT NULL,
  \`total_price\` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (data.orders && data.orders.length > 0) {
  sql += `INSERT INTO \`orders\` (
  \`id\`, \`order_number\`, \`customer_name\`, \`customer_phone\`, \`customer_email\`, 
  \`order_type\`, \`address\`, \`landmark\`, \`payment_method\`, \`payment_status\`, 
  \`order_status\`, \`subtotal\`, \`tax\`, \`delivery_fee\`, \`discount\`, \`total\`, \`notes\`, \`created_at\`
) VALUES\n`;

  const orderRows = data.orders.map(o => {
    const createdAt = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
    return `  (${escapeSql(o.id)}, ${escapeSql(o.orderNumber || o.id)}, ${escapeSql(o.customerName)}, ${escapeSql(o.customerPhone || o.phone || '')}, ${escapeSql(o.customerEmail || null)}, ${escapeSql(o.orderType || 'delivery')}, ${escapeSql(o.address || '')}, ${escapeSql(o.landmark || '')}, ${escapeSql(o.paymentMethod || 'cod')}, ${escapeSql(o.paymentStatus || 'pending')}, ${escapeSql(o.orderStatus || o.status || 'Pending')}, ${o.subtotal || 0}, ${o.tax || 0}, ${o.deliveryFee || 0}, ${o.discount || 0}, ${o.total || 0}, ${escapeSql(o.notes || '')}, ${escapeSql(createdAt)})`;
  });

  sql += orderRows.join(',\n') + ';\n\n';

  let allOrderItems = [];
  data.orders.forEach(o => {
    if (o.items && Array.isArray(o.items)) {
      o.items.forEach(it => {
        const addons = it.selectedAddOns ? JSON.stringify(it.selectedAddOns) : null;
        allOrderItems.push(`  (${escapeSql(o.id)}, ${escapeSql(it.id || '')}, ${escapeSql(it.name || 'Item')}, ${it.price || 0}, ${it.quantity || 1}, ${escapeSql(it.selectedSize || null)}, ${addons ? escapeSql(addons) : 'NULL'}, ${it.totalPrice || 0})`);
      });
    }
  });

  if (allOrderItems.length > 0) {
    sql += `INSERT INTO \`order_items\` (\`order_id\`, \`item_id\`, \`name\`, \`price\`, \`quantity\`, \`selected_size\`, \`selected_addons\`, \`total_price\`) VALUES\n`;
    sql += allOrderItems.join(',\n') + ';\n\n';
  }
}

sql += `-- =========================================================
-- 7. Table: reviews
-- =========================================================
DROP TABLE IF EXISTS \`reviews\`;
CREATE TABLE \`reviews\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`location\` VARCHAR(100) DEFAULT '',
  \`rating\` INT NOT NULL DEFAULT 5,
  \`comment\` TEXT NOT NULL,
  \`item_ordered\` VARCHAR(150) DEFAULT '',
  \`date\` VARCHAR(50) DEFAULT '',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (data.reviews && data.reviews.length > 0) {
  sql += `INSERT INTO \`reviews\` (\`id\`, \`name\`, \`location\`, \`rating\`, \`comment\`, \`item_ordered\`, \`date\`) VALUES\n`;
  const reviewRows = data.reviews.map(r => 
    `  (${escapeSql(r.id)}, ${escapeSql(r.name)}, ${escapeSql(r.location || '')}, ${r.rating || 5}, ${escapeSql(r.comment || '')}, ${escapeSql(r.itemOrdered || '')}, ${escapeSql(r.date || '')})`
  );
  sql += reviewRows.join(',\n') + ';\n\n';
}

sql += `SET FOREIGN_KEY_CHECKS = 1;
-- =========================================================
-- End of SQL Export for Pizza House Quetta
-- =========================================================
`;

const outputPath = path.join(__dirname, '..', 'pizza_house_quetta.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

const outputSchemaPath = path.join(__dirname, '..', 'database.sql');
fs.writeFileSync(outputSchemaPath, sql, 'utf8');

console.log('Successfully generated SQL files:');
console.log('1. ' + outputPath);
console.log('2. ' + outputSchemaPath);
