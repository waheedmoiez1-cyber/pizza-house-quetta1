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

## ☁️ Deployment Instructions

### Deploy to Vercel (1-Click Deployment)
1. Push this repository to GitHub/GitLab.
2. Import project into Vercel dashboard.
3. Vercel automatically detects Next.js. Click **Deploy**.

### Deploy to VPS / Docker / Standalone Server
This project has `output: 'standalone'` enabled in `next.config.ts`.
1. Run `npm run build`.
2. Transfer the `.next/standalone` folder and `public/` directory to your server.
3. Start the node server: `node .next/standalone/server.js`.
