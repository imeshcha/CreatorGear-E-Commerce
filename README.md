# CreatorGear (GEAR.)

> A modern, premium multi-vendor e-commerce web application engineered specifically for content creators (filmmakers, YouTubers, photographers, streamers, and production teams).

Built strictly according to the architecture and design guidelines outlined in the **CreatorGear Specification Document**.

---

## 🚀 Live Tech Stack

* **Frontend & Server Engine:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons
* **Database & Storage:** Supabase PostgreSQL, Row Level Security (RLS), Supabase Storage
* **Authentication:** Supabase Auth (Single account for Buyer & Seller actions)
* **Form & API Validation:** Zod
* **Tri-Method Payments:**
  1. **PayHere Online Payment:** Hosted checkout API with server-side MD5 signature generation and IPN webhook validation.
  2. **Direct Cryptocurrency:** Real on-chain EVM (Ethereum / Sepolia / Polygon) verification via JSON-RPC node provider (`ethers.js`).
  3. **Cash on Delivery (COD):** Integrated courier tracking reference generation and ledger settlement reconciliation.

---

## 📁 Project Architecture & Key Files

```
creatorgear/
├── supabase/
│   ├── schema.sql             # 30+ tables (users, seller_profiles, products, orders, ledger, etc.)
│   └── seed.sql               # Categories, top brands, and initial verified listings
├── src/
│   ├── app/
│   │   ├── page.tsx           # Luxury Ultra-Minimalist Storefront & Catalog
│   │   ├── product/[slug]/    # Detailed item page (condition disclosures, zoom, specs)
│   │   ├── cart/              # Multi-vendor cart with stock checks
│   │   ├── checkout/          # Tri-Method Payment Checkout
│   │   ├── order/success/     # Order tracking & on-chain verification confirmation
│   │   ├── seller/apply/      # Seller Verification Onboarding
│   │   ├── admin/             # Seller verification moderation dashboard
│   │   ├── account/           # Dual Buyer / Seller Dashboard with financial ledger
│   │   └── api/
│   │       ├── checkout/route.ts                # Server price & stock validation
│   │       ├── payments/payhere/notify/route.ts # Official PayHere IPN webhook handler
│   │       ├── payments/crypto/verify/route.ts  # Real JSON-RPC on-chain verification
│   │       └── seller/apply/route.ts            # Verification compliance queue
│   ├── components/
│   │   ├── Navbar.tsx         # Minimal top navigation bar ("GEAR.")
│   │   ├── HeroShowcase.tsx   # Master UI design prompt hero container
│   │   ├── ProductCatalog.tsx # Faceted filter sidebar & product grid
│   │   └── ProductCard.tsx    # Card with verified badges & condition tags
│   ├── context/
│   │   └── CartContext.tsx    # Persistent cart with stock clamping
│   ├── lib/
│   │   ├── db/products.ts     # Supabase + fallback catalog engine
│   │   ├── payments/
│   │   │   ├── payhere.ts     # PayHere MD5 signature generator & verifier
│   │   │   └── crypto.ts      # Real ethers.js JSON-RPC verification service
│   │   └── supabase/
│   │       ├── client.ts      # Browser Supabase client
│   │       └── admin.ts       # Service role client
│   └── types/index.ts         # Complete domain interfaces
```

---

## ⚡ Quick Start

### 1. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Connect Supabase Database
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in Supabase and run the script in [`supabase/schema.sql`](file:///d:/Projects/creatorgear/supabase/schema.sql).
3. Then execute [`supabase/seed.sql`](file:///d:/Projects/creatorgear/supabase/seed.sql).
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Deploy to Vercel
1. Initialize or push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete CreatorGear marketplace platform"
   git remote add origin https://github.com/your-username/creatorgear.git
   git push -u origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Add the environment variables from `.env.example` in Vercel Project Settings.
4. Click **Deploy**.
