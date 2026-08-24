# 🍕 Pizza House Quetta — Complete Setup & Transfer Guide

This guide contains everything you need to run, configure, and transfer the **Pizza House Quetta** web application on any computer or server.

---

## 📑 Table of Contents
1. [Prerequisites](#-1-prerequisites)
2. [Quick Start (Local Development)](#-2-quick-start-local-development)
3. [MySQL Database Setup (XAMPP / phpMyAdmin)](#-3-mysql-database-setup)
4. [Using 1-Click Launchers (Windows)](#-4-using-1-click-launchers-windows)
5. [Admin Portal Access & Credentials](#-5-admin-portal-access--credentials)
6. [Transferring to Another Computer](#-6-transferring-to-another-computer)
7. [Deploying Online (Vercel / Cloud)](#-7-deploying-online-vercel--cloud)
8. [Troubleshooting & FAQs](#-8-troubleshooting--faqs)

---

## 📦 1. Prerequisites

Make sure the computer has:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org))
- **(Optional) XAMPP / MySQL**: If you want to use the local MySQL database ([Download XAMPP](https://www.apachefriends.org))

---

## ⚡ 2. Quick Start (Local Development)

### Step 1: Open Terminal in Project Folder
Open PowerShell, Command Prompt, or VS Code Terminal in the `pizza-house-quetta` folder.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Visit [**http://localhost:3000**](http://localhost:3000) in your web browser.

---

## 🐬 3. MySQL Database Setup

The app comes with a complete pre-populated SQL database dump: [`pizza_house_quetta.sql`](./pizza_house_quetta.sql).

### How to Import via phpMyAdmin (XAMPP):
1. Open **XAMPP Control Panel** and click **Start** next to **Apache** and **MySQL**.
2. Open your browser and navigate to: [**http://localhost/phpmyadmin**](http://localhost/phpmyadmin).
3. Click the **Import** tab at the top.
4. Click **Choose File** (or Browse) and select `pizza_house_quetta.sql` from this project folder.
5. Click **Import** (or **Go**) at the bottom.
6. The `pizza_house_quetta` database will be created with all menu items, categories, orders, reviews, and settings!

### Configure Connection in `.env.local`:
Open `.env.local` and verify:
```env
USE_MYSQL=true
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=pizza_house_quetta
```

### Test Connection:
Visit [**http://localhost:3000/api/db-status**](http://localhost:3000/api/db-status) to see real-time connection health and table statistics.

> [!NOTE]
> If MySQL is stopped or not installed, the app will automatically fall back to its internal `data/db.json` file without crashing!

---

## 🖱️ 4. Using 1-Click Launchers (Windows)

- [**`run.bat`**](./run.bat) — **Unified Environment Launcher & Control Center**:
  - Automatically verifies and auto-detects Node.js path.
  - Auto-initializes `.env.local` from `.env.example` if absent.
  - Provides an interactive dashboard menu with options to run Production Server, Development Server, Build Bundle, Install Modules, Test MySQL Database, Sync Upstash Cloud Redis, Free Port 3000, Clean Cache, and Open Browser.
  - Supports direct CLI flags (e.g. `run.bat dev`, `run.bat prod`, `run.bat build`, `run.bat db`, `run.bat sync`, `run.bat kill`).
- [**`dev.bat`**](./dev.bat) — Quick shortcut to launch development mode with live reload.

---

## 🔑 5. Admin Portal Access & Credentials

- **Admin Login URL**: [**http://localhost:3000/admin/login**](http://localhost:3000/admin/login)
- **Admin Dashboard**: [**http://localhost:3000/admin**](http://localhost:3000/admin)
- **Username**: `admin`
- **Password**: `Dtan@1234`

### What You Can Do in the Admin Portal:
1. **Live Orders**: View incoming customer orders, change statuses (`Pending`, `Preparing`, `Out for Delivery`, `Delivered`), and print Kitchen Order Tickets (KOT).
2. **Menu Management**: Add new items, update prices, change descriptions, upload pictures, and toggle stock availability (`In Stock` / `Out of Stock`).
3. **Categories**: Create, edit, and reorder categories.
4. **Store Settings**: Update shop address, phone number, delivery fees, minimum free delivery amount, and top announcement banner.

---

## 🚀 6. Transferring to Another Computer

To move this project to a different laptop, PC, or client's computer:

1. **Copy the entire folder** (you can omit `node_modules` and `.next` to make the zip file small).
2. On the new computer, open the folder and run:
   ```bash
   npm install
   ```
3. *(Optional)* If using MySQL on the new machine:
   - Import `pizza_house_quetta.sql` in phpMyAdmin.
4. Run `npm run dev` or double-click `run.bat`!

---

## ☁️ 7. Deploying Online (Vercel / Cloud)

1. Push your repository to **GitHub**.
2. Go to [**Vercel**](https://vercel.com) and click **Add New Project** -> **Import Git Repository**.
3. In **Environment Variables**, add:
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `Dtan@1234`
   - `NEXT_PUBLIC_SITE_URL`: `https://your-site.vercel.app`
4. Click **Deploy**!

---

## ❓ 8. Troubleshooting & FAQs

### Port 3000 is already in use:
If port 3000 is occupied, you can run:
```bash
npm run dev -- -p 3001
```

### MySQL Connection Error:
1. Check that MySQL service is running in XAMPP Control Panel.
2. Check that database name in `.env.local` is `pizza_house_quetta`.
3. If you do not wish to use MySQL, set `USE_MYSQL=false` in `.env.local`.
