# FarmPOS — Project Overview

> A modern SaaS-ready Farm & Pet Shop Point-of-Sale system built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Zustand.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Architecture](#project-architecture)
3. [Full Folder Structure](#full-folder-structure)
4. [Modules & Features](#modules--features)
5. [API Routes](#api-routes)
6. [State Management](#state-management)
7. [Printer System](#printer-system)
8. [Swagger API Docs](#swagger-api-docs)
9. [Mock Data](#mock-data)
10. [SaaS & Migration Design](#saas--migration-design)
11. [Run Commands](#run-commands)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.2 |
| Language | TypeScript | ^5 |
| UI Styling | Tailwind CSS | v4 |
| State Management | Zustand | ^5 |
| Print | react-to-print | ^3.3 |
| API Docs | swagger-jsdoc + swagger-ui-react | ^6 / ^5 |
| Runtime | Node.js | ≥18 |
| Package Manager | npm | — |

---

## Project Architecture

```
Feature-based Modular Architecture
────────────────────────────────────────────────────────────
  app/             → Next.js App Router pages + API routes
  modules/         → Feature modules (UI components per domain)
  store/           → Zustand global state stores
  lib/             → Pure utilities, API clients, mock data, Swagger config
  components/      → Shared reusable UI primitives + layout shell
  types/           → Shared TypeScript domain types
────────────────────────────────────────────────────────────
```

**Key architectural decisions:**

- `(dashboard)` route group — shared sidebar/topbar shell without affecting URLs
- Server Components by default; `'use client'` only where interactivity is needed
- All API clients live in `lib/api/` — swap base URL to migrate to .NET microservices
- `tenantId` on all domain records — ready for multi-tenant SaaS
- Mock data in `lib/mock/` — in-memory (resets on server restart), easy DB swap
- `params` is always `await`-ed (Next.js 16 breaking change)
- Tailwind v4 — no `tailwind.config.js`, tokens in `globals.css @theme`

---

## Full Folder Structure

```
farm-pos/
│
├── app/
│   ├── layout.tsx                          # Root layout — Geist font, FarmPOS title
│   ├── page.tsx                            # Redirects → /pos
│   ├── globals.css                         # Tailwind v4 import + print CSS
│   │
│   ├── (dashboard)/                        # Route group — shared app shell
│   │   ├── layout.tsx                      # Sidebar + ToastContainer
│   │   ├── pos/page.tsx                    # POS terminal
│   │   ├── products/page.tsx               # Product management
│   │   ├── orders/page.tsx                 # Orders history
│   │   ├── customers/page.tsx              # Customer management
│   │   ├── inventory/page.tsx              # Inventory & stock
│   │   ├── reports/page.tsx                # Sales reports
│   │   └── settings/printer/page.tsx       # Printer configuration
│   │
│   ├── api-docs/page.tsx                   # Swagger UI (ssr:false)
│   │
│   └── api/
│       ├── swagger/route.ts                # GET /api/swagger → OpenAPI spec JSON
│       ├── products/
│       │   ├── route.ts                    # GET (list+filter), POST
│       │   └── [id]/route.ts               # GET, PUT, DELETE
│       ├── orders/
│       │   ├── route.ts                    # GET (list+status filter), POST
│       │   └── [id]/route.ts               # GET, PUT, DELETE
│       ├── customers/
│       │   ├── route.ts                    # GET (list+search), POST
│       │   └── [id]/route.ts               # GET, PUT, DELETE
│       ├── inventory/
│       │   ├── route.ts                    # GET (list, ?lowStock=true)
│       │   └── [id]/route.ts               # GET, PUT (stock adjustment)
│       └── reports/route.ts                # GET (summary, ?from=&to=)
│
├── modules/                                # Feature-scoped UI components
│   ├── pos/
│   │   ├── components/
│   │   │   ├── CategoryFilter.tsx          # Category pill tabs
│   │   │   ├── ProductGrid.tsx             # Product search + tile grid
│   │   │   ├── ProductTile.tsx             # Single tappable product card
│   │   │   ├── CartItem.tsx                # Cart row with qty controls
│   │   │   ├── CartPanel.tsx               # Right panel — cart + totals + pay button
│   │   │   ├── PaymentModal.tsx            # Cash/card/split payment dialog
│   │   │   ├── ReceiptModal.tsx            # Receipt preview + print button
│   │   │   └── ThermalReceipt.tsx          # Print-ready thermal receipt template
│   │   └── types.ts
│   │
│   ├── products/
│   │   └── components/
│   │       ├── ProductTable.tsx            # CRUD table with search
│   │       └── ProductForm.tsx             # Add/edit product modal
│   │
│   ├── orders/
│   │   └── components/
│   │       ├── OrderTable.tsx              # Orders list with status filter
│   │       └── OrderStatusBadge.tsx        # Paid / Pending / Cancelled badge
│   │
│   ├── customers/
│   │   └── components/
│   │       ├── CustomerTable.tsx           # CRUD table with loyalty points
│   │       └── CustomerForm.tsx            # Add/edit customer modal
│   │
│   ├── inventory/
│   │   └── components/
│   │       ├── InventoryTable.tsx          # Stock levels table
│   │       ├── LowStockAlert.tsx           # Orange warning banner
│   │       └── StockAdjustModal.tsx        # +/- stock adjustment dialog
│   │
│   └── reports/
│       └── components/
│           ├── SalesSummaryCard.tsx        # 4 KPI stat cards
│           ├── TopProductsTable.tsx        # Top 10 products by revenue
│           └── RevenueByCategory.tsx       # Category breakdown bar chart
│
├── store/                                  # Zustand global state
│   ├── posStore.ts                         # Cart items, payment modal, receipt modal
│   ├── productStore.ts                     # Products list + CRUD actions
│   ├── orderStore.ts                       # Orders list + create/update
│   ├── customerStore.ts                    # Customers list + CRUD actions
│   ├── inventoryStore.ts                   # Inventory list + stock adjust
│   ├── uiStore.ts                          # Sidebar open/close, toast notifications
│   └── printerStore.ts                     # Printer settings + business info
│
├── lib/
│   ├── utils.ts                            # formatCurrency, formatDate, generateId, cn()
│   ├── swagger.ts                          # OpenAPI 3.0 spec builder (swagger-jsdoc)
│   ├── api/
│   │   ├── client.ts                       # Typed apiFetch<T> wrapper
│   │   ├── products.ts                     # API call functions — products
│   │   ├── orders.ts                       # API call functions — orders
│   │   ├── customers.ts                    # API call functions — customers
│   │   ├── inventory.ts                    # API call functions — inventory
│   │   └── reports.ts                      # API call functions — reports
│   └── mock/
│       ├── products.ts                     # 20 sample products (farm + pet shop)
│       ├── orders.ts                       # 4 sample orders
│       ├── customers.ts                    # 5 sample customers
│       └── inventory.ts                    # Auto-generated from products
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx                      # primary / secondary / danger / ghost / outline
│   │   ├── Input.tsx                       # Label, error, left icon support
│   │   ├── Modal.tsx                       # Backdrop + ESC close + sizes
│   │   ├── Badge.tsx                       # green / red / yellow / blue / gray / orange
│   │   ├── Card.tsx                        # Rounded card with optional padding
│   │   ├── Spinner.tsx                     # Loading spinner
│   │   └── Toast.tsx                       # Auto-dismiss toast notifications
│   └── layout/
│       ├── Sidebar.tsx                     # Collapsible nav sidebar (icon + label)
│       └── Topbar.tsx                      # Top header with sidebar toggle
│
└── types/
    └── index.ts                            # All shared domain types
```

---

## Modules & Features

### 🛒 POS (Point of Sale)
- Product grid with category filter tabs (9 categories)
- Search by product name or SKU
- Add products to cart with one tap
- Increase / decrease quantity per item
- Item-level and order-level discount support
- Live subtotal, tax (9%), and total calculation
- Cash payment with change calculator + quick amount buttons
- Card payment and split payment modes
- Auto stock deduction on checkout
- Post-payment receipt preview + thermal print

### 📦 Products
- Full CRUD — add, edit, delete products
- 8 categories: Pet Food, Pet Accessories, Farm Supplies, Livestock Feed, Veterinary, Seeds & Plants, Tools & Equipment, Other
- Fields: Name, SKU, Category, Selling Price, Cost Price, Stock, Low Stock Threshold, Description
- Low stock and out-of-stock visual indicators

### 📋 Orders
- Full order history table
- Filter by status: All / Pending / Paid / Cancelled
- Search by order number or customer name
- Mark pending orders as paid or cancelled
- Order detail: items, subtotal, tax, discount, total, payment method

### 👥 Customers
- Full CRUD — add, edit, delete customers
- Fields: Name, Email, Phone, Address, Notes
- Tracks: Loyalty Points, Total Spent, Order Count
- Search by name, email, or phone

### 🏭 Inventory
- Real-time stock levels for all products
- Available stock = current stock − reserved stock
- Low Stock Alert banner (orange) when items hit threshold
- Stock Adjust modal — add or remove stock with +/− input

### 📊 Reports
- 4 KPI cards: Total Revenue, Total Orders, Items Sold, Avg Order Value
- Top 10 products by revenue table
- Revenue by category horizontal progress bar chart
- Date range filter (from/to) via API query params

### 🖨️ Printer Settings
- Paper width: 58mm / 80mm (recommended) / A4
- Connection: Browser / WiFi (IP) / Bluetooth / USB
- Business info: name, tagline, address, phone, email, GST number, footer
- Receipt options: auto-print, 2 copies, show SKU, tax %, customer name, barcode
- 15 compatible printer models listed (Epson, Star, TVS, Bixolon, etc.)

### 📖 API Docs
- Swagger UI at `/api-docs`
- All endpoints documented with JSDoc in route files
- Request/response schemas, example payloads, error responses

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (`?category=`, `?q=`) |
| POST | `/api/products` | Create product |
| GET | `/api/products/:id` | Get single product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders (`?status=`) |
| POST | `/api/orders` | Create order (checkout) |
| GET | `/api/orders/:id` | Get single order |
| PUT | `/api/orders/:id` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/customers` | List customers (`?q=`) |
| POST | `/api/customers` | Create customer |
| GET | `/api/customers/:id` | Get single customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| GET | `/api/inventory` | List inventory (`?lowStock=true`) |
| GET | `/api/inventory/:id` | Get single item |
| PUT | `/api/inventory/:id` | Adjust stock (`{ adjustment: 25 }`) |
| GET | `/api/reports` | Sales summary (`?from=&to=`) |
| GET | `/api/swagger` | OpenAPI spec JSON |

**Unified response format:**
```json
// List
{ "data": [...], "total": 20 }

// Single
{ "data": { ... } }

// Delete
{ "success": true }

// Error
{ "error": "message", "details": "optional" }
```

---

## State Management

7 Zustand stores — all `'use client'`:

| Store | Responsibility |
|---|---|
| `posStore` | Cart items, totals, payment modal, receipt modal, active customer |
| `productStore` | Products cache, CRUD actions |
| `orderStore` | Orders cache, create / update status |
| `customerStore` | Customers cache, CRUD actions |
| `inventoryStore` | Inventory cache, stock adjustment |
| `uiStore` | Sidebar open/close, toast notifications queue |
| `printerStore` | Paper width, connection type, business info, receipt options |

---

## Printer System

### Supported connection types
| Type | How it works |
|---|---|
| Browser | System print dialog — works with any installed printer |
| WiFi / Network | Enter printer static IP — direct network print |
| Bluetooth | Web Bluetooth API — pair once in Chrome/Edge |
| USB / Direct | OS printer list — select thermal printer in dialog |

### Paper sizes
| Size | Width | Best for |
|---|---|---|
| 58mm | 218px | Small/compact thermal printers |
| **80mm** | **302px** | **Industry standard — recommended** |
| A4 | 595px | Laser / inkjet full page |

### Print CSS
`@page { size: 80mm auto; margin: 0; }` — browser sends exact paper size to printer.
`@media print` hides all UI except the `.thermal-receipt` element.

### Compatible printers (tested models)
Epson TM-T82, TM-T88, TM-T20 · Star TSP143, TSP654 · Bixolon SRP-350 · TVS RP-45, RP-3200 · Posiflex PP-8000 · Xprinter XP-N160II · Any ESC/POS compatible printer

---

## Swagger API Docs

- **URL:** `http://localhost:3000/api-docs`
- **Spec endpoint:** `http://localhost:3000/api/swagger`
- All route handlers have JSDoc `@swagger` annotations
- Schemas defined in `lib/swagger.ts` under `components.schemas`
- Auto-updates when JSDoc comments in `app/api/**/*.ts` are changed

---

## Mock Data

Located in `lib/mock/` — plain TypeScript arrays, imported by route handlers.
Data resets on every server restart (no persistence layer yet).

| File | Contents |
|---|---|
| `products.ts` | 20 products across 8 categories (Pet Food, Livestock, Farm, etc.) |
| `customers.ts` | 5 customers with loyalty points and order history |
| `orders.ts` | 4 orders (3 paid, 1 pending) with line items |
| `inventory.ts` | Auto-generated from products (maps stock levels) |

**To add a real database later:** Replace `lib/mock/*.ts` imports in route handlers with DB queries. No component changes needed.

---

## SaaS & Migration Design

### Multi-tenant ready
- Every domain type has `tenantId: string` field
- API routes read `x-tenant-id` header (stubbed to `'default'`)
- When auth is added, set `tenantId` from JWT/session and filter all queries

### .NET microservices migration path
```
Current:  Component → Zustand Store → lib/api/products.ts → /api/products (Next.js route)
Future:   Component → Zustand Store → lib/api/products.ts → https://api.farmpos.com/products
```
Only `lib/api/client.ts` needs one change:
```ts
// Change this env variable:
NEXT_PUBLIC_API_BASE_URL=https://api.farmpos.com
```
Zero component changes required.

### Environment variables
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=           # Leave empty for local Next.js routes
                                    # Set to https://your-backend.com for production
```

---

## Run Commands

### Development
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
```
App runs at: **http://localhost:3000**

---

### Build & Production
```bash
# Type-check all files (no emit)
npx tsc --noEmit

# Build for production
npm run build

# Start production server (after build)
npm start
```

---

### Linting
```bash
# Run ESLint
npm run lint
```

---

### Key URLs (after `npm run dev`)

| URL | Description |
|---|---|
| `http://localhost:3000` | Redirects to POS terminal |
| `http://localhost:3000/pos` | POS Terminal |
| `http://localhost:3000/products` | Product Management |
| `http://localhost:3000/orders` | Orders History |
| `http://localhost:3000/customers` | Customer Management |
| `http://localhost:3000/inventory` | Inventory & Stock |
| `http://localhost:3000/reports` | Sales Reports |
| `http://localhost:3000/settings/printer` | Printer Configuration |
| `http://localhost:3000/api-docs` | Swagger API Documentation |
| `http://localhost:3000/api/swagger` | Raw OpenAPI JSON spec |

---

### First-time Setup
```bash
# 1. Clone / open the project folder
cd "farm-pos"

# 2. Install all dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

### Troubleshooting
```bash
# Clear Next.js build cache and rebuild
rm -rf .next && npm run build

# Reinstall node_modules from scratch
rm -rf node_modules package-lock.json && npm install

# Check TypeScript errors
npx tsc --noEmit

# Check Next.js version
npx next --version
```

---

*Last updated: April 2026 — FarmPOS v0.1.0*
