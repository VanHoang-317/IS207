# Glow & Co. — E-Commerce Platform

A full-stack e-commerce web application for a premium skincare and haircare brand, built with **Next.js 16** and **Express 5**.

---

## Problem Statement

Small-to-medium beauty brands often rely on generic marketplace platforms (Amazon, Flipkart) that dilute their brand identity and take significant commission. **Glow & Co.** solves this by providing a custom, brand-owned storefront that delivers:

- A premium shopping experience that reflects brand aesthetics
- Direct customer relationships (auth, wishlist, reviews)
- Full control over product catalog, pricing, and promotions
- Integrated payment processing (Razorpay) and order management
- An admin panel for inventory and order tracking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Custom CSS |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **UI Components** | Radix UI, Lucide Icons |
| **Backend** | Express 5, Node.js |
| **Database** | PostgreSQL (with UUID extension) |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) |
| **Payments** | Razorpay |
| **Security** | Helmet, CORS, express-rate-limit, express-validator |
| **Dev Tools** | ESLint, Nodemon, TypeScript |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT                                 │
│                                                                 │
│  Next.js 16 (React 19)        Zustand Stores                    │
│  ┌──────────────────┐         ┌──────────────┐                  │
│  │  Pages (SSR/CSR) │◄─────── │  Auth Store  │                  │
│  │  ─────────────── │         │  Cart Store  │                  │
│  │  Home            │         │  Wishlist    │                  │
│  │  Products        │         └──────────────┘                  │
│  │  Product Detail  │                                           │
│  │  Cart / Checkout │         Axios HTTP Client                 │
│  │  Auth (Login/Reg)│          ┌──────────────┐                 │
│  │  Dashboard       │────────► │  GET / POST   │                │
│  │  Wishlist        │          │  PUT / DELETE │                │
│  │  Admin Panel     │          └───────┬───────┘                │
│  └──────────────────┘                  │                        │
└────────────────────────────────────────┼─────────────────────────┘
                                         │ HTTP :5000
┌────────────────────────────────────────┼─────────────────────────┐
│                          SERVER        │                         │
│                                        ▼                         │
│  Express 5               ┌──────────────────────┐                │
│  ┌───────────────┐       │     Middleware       │                │
│  │   Routes      │       │  ──────────────────  │                │
│  │  ──────────── │       │  JWT Auth            │                │
│  │  /auth        │◄───── │  Helmet (Security)   │                │
│  │  /products    │       │  CORS                │                │
│  │  /orders      │       │  Rate Limiter        │                │
│  │  /reviews     │       │  Input Validation    │                │
│  │  /wishlist    │       └──────────────────────┘                │
│  │  /payments    │                                               │
│  │  /logistics   │        ┌──────────────────────┐               │
│  └───────┬───────┘        │     Services         │               │
│          │                │  ──────────────────  │               │
│          ▼                │  Razorpay Payment    │               │
│  ┌───────────────┐        └──────────────────────┘               │ 
│  │  Controllers  │                                               │
│  │  → Models     │───────► PostgreSQL                            │
│  └───────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema

```
users ──────────┐
                ├──► orders ──► order_items
                ├──► addresses
                ├──► reviews
                └──► wishlists

products ───────┤
                ├──► product_variants
                ├──► reviews
                └──► wishlists

categories
coupons
```

---

## Features

### Customer-Facing
- **Homepage** — Full-bleed editorial hero, category browsing, featured products
- **Product Catalog** — Filter by category (Skin Care / Hair Care), product grid with ratings
- **Product Detail** — Image gallery, description, reviews and ratings
- **Cart** — Add/remove items, quantity management, price summary
- **Checkout** — Address form, Razorpay payment integration
- **Wishlist** — Save products for later, synced with backend
- **User Auth** — Registration with password strength indicator, login with JWT
- **User Dashboard** — Order history, account management

### Admin
- **Admin Panel** — Product management (CRUD), order tracking, analytics

### Technical
- **JWT Authentication** — Secure token-based auth with bcrypt password hashing
- **Razorpay Payments** — Integrated payment gateway
- **Rate Limiting** — API abuse prevention
- **Input Validation** — Server-side validation with express-validator
- **Responsive Design** — Mobile-first, works on all screen sizes
- **State Persistence** — Zustand for client-side state management

---

## Project Structure

```
ecommerce-website/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── products/        # Product listing
│   │   │   ├── product/         # Product detail
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── checkout/        # Checkout flow
│   │   │   ├── wishlist/        # Wishlist
│   │   │   ├── dashboard/       # User dashboard
│   │   │   └── admin/           # Admin panel
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LayoutShell.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductReviews.tsx
│   │   ├── lib/                 # API client, utilities
│   │   └── store/               # Zustand stores (auth, cart, wishlist)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── index.js             # Server entry point
│   │   ├── app.js               # Express app config
│   │   ├── config/              # Database config
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Database models + schema.sql
│   │   ├── middleware/           # Auth, validation
│   │   ├── services/            # Payment service (Razorpay)
│   │   └── utils/               # Helper utilities
│   ├── seedProducts.js          # Database seeder
│   └── package.json
│
├── screenshots/                 # App screenshots
└── README.md
```

---

## How to Run

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database
- **Razorpay** account (for payments)

### 1. Clone the repository

```bash
git clone https://github.com/codewithyuvraj24/nextjs-ecommerce-app.git
cd nextjs-ecommerce-app
```

### 2. Set up the database

Create a PostgreSQL database and run the schema:

```bash
psql -U your_user -d your_database -f backend/src/models/schema.sql
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Shiprocket logistics (optional, for shipping labels + tracking)
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_DEFAULT_PHONE=9999999999
```

### 4. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Seed products (optional)

```bash
cd backend
node seedProducts.js
```

### 6. Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Shop by Category
![Categories](screenshots/categories.png)

### Product Catalog
![Products](screenshots/products.png)

### Login
![Login](screenshots/login.png)

### Register
![Register](screenshots/register.png)

### Cart
![Cart](screenshots/cart.png)

---

## License

This project is for educational and portfolio purposes.
