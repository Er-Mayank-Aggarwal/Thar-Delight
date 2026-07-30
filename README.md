# Thar Delight 🍪✨

Welcome to **Thar Delight** — an artisanal e-commerce web application built with Next.js 16, Tailwind CSS, Prisma ORM, Neon PostgreSQL, and Better Auth. It showcases and sells wholesome millet treats, traditional farali cookies, and handcrafted wooden serveware directly from Rajasthan, India.

---

## 🌟 Key Features

- **Artisanal UI/UX**: Premium color palette (rich browns, golds, and warm sand tones) with dynamic animations and glassmorphic micro-interactions.
- **Smart Sticky Navigation**: Auto-hiding header on scroll down, instant reveal on scroll up anywhere on the page.
- **Live Database Integration**: Real-time product, review, category, order, and inventory management powered by PostgreSQL.
- **Authentication**: Secure passwordless and Google OAuth login via Better Auth.
- **Admin Dashboard**: Comprehensive order processing, product CRUD, coupon management, and review moderation.
- **Performance & Security**: In-memory rate limiting, Zod input validation schemas, database indexes, and edge-level route proxying.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless DB with connection pooling)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Google OAuth & Email/Password)
- **Media & Image Storage**: [Cloudinary](https://cloudinary.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Fonts**: Lucide React, Google Fonts (Inter, Lora, Dancing Script)
- **Validation**: Zod & custom sliding-window rate limiters

---

## 📦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Er-Mayank-Aggarwal/Thar-Delight-Frontend-.git
cd thar-delight-app
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Fill in your connection details inside `.env`:

```env
DATABASE_URL="postgresql://username:password@ep-sample-host.aws.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-32-character-random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup & Seeding

Generate the Prisma client and sync database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema and indexes to PostgreSQL database
npx prisma db push

# Seed initial products & categories
node prisma/seed.mjs
```

### 4. Grant Admin Privileges

To grant an account ADMIN access to `/admin-controls`:

```bash
node set-admin.mjs your-email@gmail.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
thar-delight-app/
├── app/
│   ├── actions/          # Server Actions (orders, products, reviews, cart, coupons)
│   ├── admin-controls/   # Protected Admin Panel (dashboard, inventory, orders)
│   ├── api/              # Better Auth API endpoints
│   ├── components/       # UI Components (Header, Footer, HeroSection, ProductCard)
│   ├── shop/             # Product catalog with search and filters
│   └── product/[slug]/   # Dynamic individual product page
├── lib/
│   ├── auth.js           # Better Auth server configuration
│   ├── prisma.js         # Singleton Prisma DB client instance
│   ├── rateLimit.js      # Sliding-window rate limiter
│   └── validations.js    # Zod schemas for input validation
├── prisma/
│   ├── schema.prisma     # DB models & performance indexes
│   └── seed.mjs          # Database seed script
├── .env.example          # Environment variable template
└── proxy.js              # Next.js 16 edge route protection middleware
```

---

## 📝 License

© 2026 Thar Delight. All rights reserved.

