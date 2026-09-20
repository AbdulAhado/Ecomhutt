# 🛍️ EcomHutt — Modern Full-Stack E-Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635bff?style=for-the-badge&logo=stripe" alt="Stripe" />
</p>

---

## 🌟 Overview

**EcomHutt** is a production-ready, high-performance full-stack e-commerce web application engineered with **Next.js (App Router)** on the frontend and an **Express / MongoDB** REST API backend. It features seamless **Stripe payment checkout**, real-time **Stripe webhooks**, automated transactional order confirmation emails, a comprehensive **Admin Dashboard**, robust customer order tracking, and ultra-smooth animations.

---

## ✨ Key Features

### 🛒 Storefront & Customer Experience
* **Dynamic Product Catalog:** Filter products by category, search by keywords, sort by price and rating.
* **Instant Cart & Persistence:** Fully synchronized shopping cart with persistent guest and logged-in states.
* **Streamlined Checkout:** Clean 1-page checkout experience with automated free delivery calculation and sales tax handling.
* **Stripe Hosted Checkout:** Secure payment checkout powered by Stripe Sessions (Supports Credit/Debit cards).
* **Live Order Tracking:** Real-time visual progress tracker for order statuses (`Pending`, `Processing`, `Shipped`, `Delivered`).
* **Customer Account Hub:** Order history, tracking links, profile management, and instant invoice previews.
* **Automated Email Receipts:** Beautiful, responsive HTML email confirmations sent to customers right after payment.

### 🛡️ Admin Management Suite
* **Executive Dashboard:** Live metrics for total sales, revenue, order counts, and active customers.
* **Product Catalog Management:** Add, edit, and delete products with multi-image Cloudinary uploads and inventory stock control.
* **Category Architecture:** Manage store categories with instant Cloudinary image banners.
* **Order Fulfillment Pipeline:** Live status updater for orders (Pending, Processing, Shipped, Delivered) with instant sync.
* **Customer Directory:** Track customer registrations, spending habits, and account details.

### 🔐 Security & Reliability
* **JWT & Cookie Authentication:** Secure token-based session management with role-based access control (Admin vs Customer).
* **Cryptographic Webhook Verification:** Verifies Stripe webhook payloads via `stripe-signature` and signing secret to prevent spoofing.
* **Rate Limiting & NoSQL Sanitization:** Built-in defenses against brute-force attacks and MongoDB injection vectors.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), Mongoose ODM |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (Replica Set Cluster) |
| **Payments** | [Stripe API](https://stripe.com/) (Checkout Sessions & Webhook Handlers) |
| **Media Hosting** | [Cloudinary](https://cloudinary.com/) (Product & Category Image CDN) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (SMTP with HTML email templates) |
| **Deployment** | Vercel (Frontend) & Render (Backend) |

---

## 📁 Project Architecture

```plaintext
EcomHutt/
├── src/
│   ├── app/
│   │   ├── (store)/               # Customer Storefront Routes
│   │   │   ├── checkout/          # Checkout page with Stripe Integration
│   │   │   ├── order/[id]/        # Order details & Pay retry
│   │   │   ├── payment/success/   # Payment confirmation & receipt
│   │   │   ├── shop/              # Product browsing & filters
│   │   │   └── track-order/       # Order tracking portal
│   │   ├── admin/                 # Protected Admin Panel
│   │   │   ├── categories/        # Category management
│   │   │   ├── customers/         # Customers list
│   │   │   ├── orders/            # Order fulfillment & status
│   │   │   └── products/          # Product CRUD & Cloudinary uploads
│   ├── components/                # Reusable UI & Layout Components
│   └── context/
│       └── ShopContext.js         # Centralized Global State & Cart Management
├── server/
│   ├── config/                    # Database & Third-party configs
│   ├── controllers/               # Business logic (Auth, Products, Orders, Stripe)
│   ├── middleware/                # Auth, Admin guard & Error handlers
│   ├── models/                    # Mongoose Schemas (User, Product, Order, Category)
│   ├── routes/                    # API endpoints
│   ├── utils/                     # Email templates & helpers
│   └── server.js                  # Server entrypoint & Stripe raw webhook route
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AbdulAhado/Ecomhutt.git
cd EcomHutt
```

### 2. Install Dependencies
Install dependencies for both frontend and backend:

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the **`server/`** folder:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_or_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Create a `.env.local` file in the **root** folder for Next.js:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_...
```

---

## 💻 Running Locally

Open two terminal windows:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend App
```bash
npm run dev
# Storefront runs on http://localhost:3000
```

---

## ⚡ Stripe Webhook Setup

To test webhooks in development using the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

In production, register your live endpoint in the [Stripe Dashboard](https://dashboard.stripe.com):
* **Endpoint URL:** `https://your-backend-domain.com/api/stripe/webhook`
* **Events to Listen:**
  * `checkout.session.completed`
  * `checkout.session.expired`
  * `payment_intent.succeeded`
  * `payment_intent.payment_failed`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/AbdulAhado">Abdul Ahad</a>
</p>
