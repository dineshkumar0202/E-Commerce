# myshopping Advanced E-commerce

Features:

- Vite + React + Tailwind CSS frontend, Flipkart-like hero/category/product layout
- Node + Express + MongoDB backend
- 50+ seeded products
- Auth: login, register, forgot/reset password, (placeholder) Google login endpoint
- JWT auth with HttpOnly cookie
- Cart (localStorage) + wishlist (per user)
- User profile & orders
- Stripe payment (test keys via .env)
- Admin dashboard: stats, order flow pie chart, revenue line chart, recent orders table

## Setup

### 1. MongoDB

Run MongoDB locally (default port 27017).

### 2. Backend

```bash
cd server
npm install
npm run seed   # seeds products and creates admin user
npm run dev
```

Edit `server/.env` with your own STRIPE and other secrets.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Update `client/.env` with:

- `VITE_API_URL` (default is fine)
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_GOOGLE_CLIENT_ID` (if you wire real Google login on frontend)

Admin login (after seed):

- Email: `admin@myshopping.com`
- Password: `admin123`
