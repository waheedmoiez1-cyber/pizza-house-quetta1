# 🍕 Pizza House Quetta - Fullstack E-Commerce & Admin Web Application

A fullstack Next.js 14+ (App Router), TypeScript, Tailwind CSS, and MySQL e-commerce website and secret admin portal engineered for **Pizza House Quetta** on Toghi Road.

👉 **Looking for full step-by-step instructions? Check out the [Complete Setup & Transfer Guide (SETUP_GUIDE.md)](./SETUP_GUIDE.md)**

---

## 🌟 Key Features

- **Public E-Commerce Storefront**:
  - Masterpiece Hero with interactive food showcase, auto-rotating carousel, and live scrolling marquee.
  - Scroll-driven floating discount banner (`QUETTA10` 10% OFF promo).
  - Global Search Modal accessible from top navbar.
  - Interactive Category Tabs (`Pizzas`, `Burgers`, `Shawarma`, `Broast`, `Fries`) with live search.
  - Chef's Special Value Combo Deals.
  - Customer Star Reviews with live **"Add Review"** submission modal.
  - Unique Order # Receipt tracking (`#PHQ-84920`) with direct **"Track Progress on WhatsApp"** link to hotline (`0300-1234567`).
  - Sticky Floating *"See Menu 🍕"* CTA button visible during scroll.

- **Secret Admin Portal (`/admin`)**:
  - Live Order Monitor with status filtering and search by Order #, Customer Name, Phone, or Address.
  - **Edit Order Modal**: Modify customer details, items, order total, and payment status (`Paid`/`Unpaid`).
  - **Delete Order**: Permanent database deletion with confirmation dialog.
  - **Print Kitchen Order Ticket (KOT)**: Formatted printable/forwardable production slip.
  - **WhatsApp Customer Status Alerts**: Direct WhatsApp status update links (`Preparing`, `Out for Delivery`, `Delivered`).
  - Menu & Category CRUD + Inventory Stock Switches (`In Stock` / `Out of Stock`).
  - Full Store Settings (Store Name, Phone, Address, Announcement Banner, Tax Rate, Delivery Fee, Open/Closed Toggle).

---

## 🐬 MySQL Database Setup (XAMPP / Localhost / Cloud MySQL)

The application connects to a MySQL database with automatic table mapping and resilient fallback.

### 1. Import MySQL Database Schema & Seed Data
1. Start **Apache** and **MySQL** in **XAMPP Control Panel**.
2. Open **phpMyAdmin**: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Click the **Import** tab.
4. Select the file [`pizza_house_quetta.sql`](./pizza_house_quetta.sql) and click **Go** / **Import**.

### 2. Configure MySQL in `.env.local`
Ensure your `.env.local` file contains:
```env
USE_MYSQL=true
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=pizza_house_quetta
```

### 3. Check Live Connection Status
Visit `http://localhost:3000/api/db-status` to test the MySQL connection in real-time.

---

## 🚀 Quick Start Guide (Transfer & Local Setup)

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build & Launch
```bash
npm run build
npm run start
```

---

## 🔑 Secret Admin Credentials

- **Admin Login Page**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `Dtan@1234`

---

## 📁 File Structure Overview

```
pizza-house-quetta/
├── app/                      # Next.js App Router (Pages & API Routes)
│   ├── admin/                # Admin Panel (Orders, Menu, Categories, Settings)
│   ├── api/                  # RESTful API routes (menu, orders, reviews, settings, db-status)
│   ├── cart/                 # Shopping Cart Page
│   ├── checkout/             # Checkout Page with COD / JazzCash / Card options
│   ├── menu/                 # Dedicated Full Menu Page
│   └── page.tsx              # Homepage
├── components/               # UI Components (Hero, Navbar, ProductCard, Modals)
├── data/
│   └── db.json               # Self-contained JSON database fallback
├── lib/
│   ├── db.ts                 # Unified database layer (MySQL + KV + JSON fallback)
│   ├── mysql.ts              # MySQL connection pool & SQL query helpers
│   ├── types.ts              # TypeScript interfaces
│   └── cart-store.ts         # Zustand cart state management
├── public/
│   └── images/               # High-res food photography
├── pizza_house_quetta.sql    # Complete MySQL Database Dump & Schema
├── next.config.ts            # Next.js config (standalone output enabled)
└── README.md                 # Project Setup & Deployment Guide
```
