# 🍕 Pizza House Quetta - Fullstack E-Commerce & Admin Web Application

A fullstack Next.js 14+ (App Router), TypeScript, and Tailwind CSS e-commerce website and secret admin portal engineered for **Pizza House Quetta** on Toghi Road.

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

## 🚀 Quick Start Guide (Transfer & Local Setup)

### 1. Installation
Clone or transfer the project directory to any computer or server, then run:

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
- **Password**: `admin123`

---

## 📁 File Structure Overview

```
pizza-house-quetta/
├── app/                      # Next.js App Router (Pages & API Routes)
│   ├── admin/                # Admin Panel (Orders, Menu, Categories, Settings)
│   ├── api/                  # RESTful API routes (menu, orders, reviews, settings)
│   ├── cart/                 # Shopping Cart Page
│   ├── checkout/             # Checkout Page with COD / JazzCash / Card options
│   ├── menu/                 # Dedicated Full Menu Page
│   └── page.tsx              # Homepage
├── components/               # UI Components (Hero, Navbar, ProductCard, Modals)
├── data/
│   └── db.json               # Self-contained JSON database (items, orders, reviews, settings)
├── lib/
│   ├── db.ts                 # Database helper functions
│   ├── types.ts              # TypeScript interfaces
│   └── cart-store.ts         # Zustand cart state management
├── public/
│   └── images/               # High-res AI food photography
├── next.config.ts            # Next.js config (standalone output enabled)
└── README.md                 # Project Transferability & Deployment Guide
```

---

## ☁️ Vercel Deployment & Backend Setup Guide

### Why Serverless requires special configuration:
Vercel executes Next.js API routes as stateless serverless functions with a read-only filesystem (`EROFS`). This project has been upgraded with:
1. **Direct JSON seed bundling**: Seed database (16 menu items, 5 categories, reviews, and settings) is compiled directly into the Next.js bundle, so public pages and API routes **never fail to load**.
2. **Serverless-Safe Memory & `/tmp` caching**: API routes gracefully handle write actions without crashing.
3. **1-Click Free Cloud Database (Upstash Redis / Vercel KV)**: For permanent cross-device persistence across serverless cold starts.

---

### Step 1: Push Code & Deploy to Vercel
1. Commit and push the updated project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Fix Vercel serverless backend and admin persistence"
   git push origin main
   ```
2. In your [Vercel Dashboard](https://vercel.com/dashboard), import your repository and click **Deploy**.

---

### Step 2: Configure Environment Variables in Vercel
Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**, and add the following:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | `admin` | Your desired admin username |
| `ADMIN_PASSWORD` | `Dtan@1234` | Your desired admin password |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Your live Vercel domain |

---

### Step 3: (Recommended) Add Free Upstash Redis / Vercel KV for Permanent Cloud Persistence
To ensure customer orders, menu edits, and store settings are permanently stored across all devices and serverless restarts:
1. In your **Vercel Project Dashboard**, navigate to the **Storage** tab.
2. Click **Create Database** and choose **KV** (or **Upstash Redis** from Marketplace - 100% Free).
3. Connect the database to your project. Vercel will automatically configure:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Redeploy your project (or push a new commit). The app will automatically sync with the cloud database!

---

### Step 4: Accessing the Admin Portal
- **Admin Portal URL**: `https://your-project.vercel.app/admin/login` (or `/admin`)
- **Username**: `admin` (or the one you set in `ADMIN_USERNAME`)
- **Password**: `Dtan@1234` (or the one you set in `ADMIN_PASSWORD`)
- From the admin portal, you can:
  - 📊 Monitor live orders in real time.
  - 🍕 Add new food items, edit prices, toggle stock (`In Stock` / `Out of Stock`).
  - 📁 Manage categories.
  - ⚙️ Update store hours, contact number, delivery fees, and announcement banners.
  - 🖨️ Print Kitchen Order Tickets (KOT) & send WhatsApp updates to customers.

