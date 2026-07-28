# Project Scope: Headless Clothing E-commerce Store (Next.js + Shopify)

## Project Overview

Develop a modern, high-performance headless clothing e-commerce website using **Next.js** as the frontend and **Shopify** as the backend. The website should provide a premium shopping experience with fast loading, SEO optimization, responsive design, and a scalable architecture.

---

# Objectives

* Build a premium clothing brand website.
* Use Shopify as the e-commerce backend.
* Use Next.js App Router for the frontend.
* Optimize for SEO and Core Web Vitals.
* Deliver an excellent mobile shopping experience.
* Support future international expansion.
* Easy content management through Shopify Admin.

---

# Tech Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod
* Shopify Storefront API (GraphQL)
* Shopify Hydrogen React (`@shopify/hydrogen-react`)
  * `ShopifyProvider` — global Shopify config
  * `CartProvider` — cart state management
  * `Image` — optimized Shopify image rendering
  * `Money` — price/currency formatting
  * `flattenConnection` — GraphQL connection flattening

## State Management

* Zustand — client-side state (wishlist, UI state, filters)
* Shopify Cart API + `CartProvider` — cart state
* React Context — auth state (session/user)
* React Server Components — server-side data fetching (no client state needed)

## Backend

* Shopify Admin
* Shopify Products
* Shopify Collections
* Shopify Inventory
* Shopify Orders
* Shopify Customers
* Shopify Discounts
* Shopify Checkout

## Hosting

* Vercel
* Shopify

---

# Data Layer Architecture

## GraphQL Client

* Use `@shopify/storefront-api-client` for Storefront API queries
* Use `@shopify/admin-api-client` for Admin API (server-side only, API routes)
* All queries co-located in `lib/shopify/queries/` and mutations in `lib/shopify/mutations/`
* Typed with auto-generated types from Shopify's GraphQL schema via `@shopify/api-codegen-preset`

## Caching Strategy

* Next.js `fetch` with `next.revalidate` for ISR on product/collection pages
* `React.cache()` for request-level deduplication within a single render
* On-demand revalidation via Shopify webhooks (product update, inventory change)
* Static generation for policy/info pages (About, FAQ, Shipping, etc.)

## Error Handling

* Centralized Storefront API error handler in `lib/shopify/client.ts`
* Retry logic (3 attempts with exponential backoff) for transient failures
* Storefront API cost-based throttle handling — track `throttleStatus` from response extensions
* Graceful degradation — show cached data or fallback UI when API is unavailable

---

# Authentication Model

## Approach

* Use **Shopify Customer Account API** (new headless OAuth flow)
* OAuth redirect flow: App → Shopify login → callback → session

## Session Management

* HTTP-only secure cookies for session tokens
* Next.js Middleware for protected route enforcement (`/account/*`)
* Token refresh handled server-side via API routes

## Protected Routes

* `/account/dashboard`
* `/account/profile`
* `/account/addresses`
* `/account/orders`
* `/account/wishlist`

## Auth Flow

1. User clicks "Login" → redirect to Shopify Customer Account login
2. Shopify authenticates → redirects back with authorization code
3. Next.js API route exchanges code for access token
4. Session cookie set → user redirected to account or previous page
5. Middleware checks session cookie on protected routes

---

# Website Pages

## Public Pages

* Home
* Shop
* New Arrivals
* Best Sellers
* Sale
* Collections
* Product Details
* Search Results
* Cart
* Wishlist
* About
* Contact
* FAQ
* Shipping Policy
* Return Policy
* Privacy Policy
* Terms & Conditions
* 404 Page

## Protected Pages (Requires Auth)

* Customer Dashboard
* Profile
* Saved Addresses
* Order History
* Account Wishlist
* Returns

## Auth Pages

* Login (Shopify OAuth redirect)
* Register (Shopify OAuth redirect)

---

# Header

* Logo
* Mega Menu
* Search
* Wishlist Icon (with count badge)
* Account Icon
* Cart Icon (with count badge)
* Currency Selector (architecture-ready via `@inContext` directive, UI deferred to Phase 3)
* Announcement Bar
* Promotional Banner

---

# Home Page

### Phase 1 (MVP)

* Hero Banner (Seasonal Collection + CTA)
* Featured Collections (Men, Women, Kids, Accessories)
* New Arrivals (product carousel)
* Best Sellers (product grid)
* Newsletter Signup

### Phase 2

* Trending Products
* Flash Sale (countdown timer)
* Brand Story
* Customer Reviews (testimonials)

### Phase 3

* Instagram Gallery (via Behold or Elfsight embed service)
* Featured Categories (visual grid)

---

# Product Listing Page

## Filters

* Category
* Collection
* Brand
* Size
* Color
* Price Range
* Availability (In Stock / Out of Stock)
* Material
* Gender
* Discount (On Sale)
* Rating

## Sorting

* Featured
* Newest
* Price Low to High
* Price High to Low
* Best Selling
* Customer Rating

---

# Product Detail Page

## Gallery

* Multiple Images
* Zoom on Hover
* Image Slider / Thumbnails
* Videos (optional)

## Product Information

* Name
* Brand
* Price (with `Money` component for currency formatting)
* Discount / Compare-at Price
* Variant Selector
* Color Selector (swatches)
* Size Selector
* Stock Status (via Storefront API `quantityAvailable`)
* SKU
* Tags

## Purchase Section

* Quantity Selector
* Add to Cart
* Buy Now (creates a single-item checkout via `checkoutCreate` mutation, skips cart)
* Add to Wishlist

## Product Details

* Description
* Size Guide
* Materials
* Care Instructions
* Shipping Information
* Return Policy

## Social Proof

* Ratings (Judge.me API)
* Reviews (Judge.me API)
* Related Products (Shopify product recommendations API)
* Frequently Bought Together (Shopify product recommendations API)

---

# Shopping Cart

* Update Quantity
* Remove Item
* Discount Code Input
* Estimated Shipping
* Order Summary (subtotal, taxes, shipping, total)
* Continue Shopping Link
* Checkout Button (redirects to Shopify Checkout)

---

# Shopify Checkout

* Secure Checkout (Shopify-hosted)
* Shipping Address
* Payment (Shopify Payments)
* Order Confirmation

---

# Customer Account

* Dashboard (overview with recent orders)
* Profile (name, email, phone)
* Saved Addresses (CRUD)
* Wishlist (synced)
* Order History (with order detail view)
* Returns (initiate return)
* Logout

---

# Search

* Instant Search (debounced, overlay)
* Search Suggestions (Shopify Predictive Search API)
* Product Search
* Collection Search
* Recent Searches (localStorage)

---

# Wishlist

## Persistence Strategy

* **Guest users:** localStorage (client-side only)
* **Logged-in users:** Shopify Customer Metafields via Admin API
  * Store product IDs as a JSON array in a customer metafield
  * Next.js API routes handle read/write to Admin API (server-side)
  * Sync localStorage → metafields on login
  * Zustand store for client-side state with optimistic updates

## Features

* Save / Remove Products
* Move to Cart
* Share Wishlist (optional, Phase 2)

---

# Reviews System

## Provider: Judge.me

* Free tier available, headless API support
* Judge.me Public API for fetching reviews (no Storefront API dependency)
* Review widget rendered client-side via API data
* Star ratings on product cards and PDP
* Review submission form on PDP
* Review moderation via Judge.me dashboard

## Integration

* Fetch reviews server-side in PDP `page.tsx` or client-side with SWR/React Query
* Cache review data with ISR (revalidate every 1 hour)
* Display aggregate rating in product structured data (JSON-LD)

---

# Shopify Backend Features

## Product Management

* Products
* Variants
* Images
* Inventory
* Collections
* Tags

## Order Management

* Orders
* Fulfillment
* Refunds
* Returns

## Customer Management

* Customer Profiles
* Order History
* Marketing Preferences

## Marketing

* Discount Codes
* Automatic Discounts
* Gift Cards
* Email Marketing Integration

---

# Integrations

* Shopify Storefront API (GraphQL)
* Shopify Admin API (GraphQL, server-side only)
* Shopify Customer Account API (OAuth)
* Shopify Predictive Search API
* Judge.me Public API (reviews)
* Google Analytics 4
* Meta Pixel
* Microsoft Clarity
* Google Search Console
* Klaviyo (email marketing)

---

# Performance

* React Server Components (default for all pages)
* Static Rendering (policy pages, about, FAQ)
* Incremental Static Regeneration (product pages, collection pages)
* `next/image` with Shopify CDN loader
* Lazy Loading (below-fold sections, images)
* Code Splitting (dynamic imports for heavy components)
* Font Optimization (next/font with Google Fonts)
* Vercel Edge Network CDN
* Shopify CDN for product media

---

# SEO

* Next.js Metadata API (`generateMetadata`)
* Dynamic Meta Tags (per product, per collection)
* Open Graph tags
* Twitter Cards
* XML Sitemap (`sitemap.ts`)
* Robots.txt (`robots.ts`)
* Canonical URLs
* Product Structured Data (JSON-LD `Product` schema)
* Breadcrumb Structured Data (JSON-LD `BreadcrumbList` schema)
* Review Structured Data (JSON-LD `AggregateRating`)

---

# Loading & Error States

## Loading States

* Skeleton UIs for product cards, product grids, PDP sections
* `loading.tsx` files per route segment
* React Suspense boundaries for streaming
* Spinner/progress indicators for cart actions

## Error States

* `error.tsx` files per route segment with retry button
* `not-found.tsx` for 404 pages
* Global error boundary at app root (`global-error.tsx`)
* Toast notifications for action failures (add to cart, wishlist, etc.)
* Graceful fallbacks when Storefront API is unreachable

---

# Security

* Environment Variables (`.env.local`, Vercel env)
* Shopify Storefront Token (public, read-only)
* Shopify Admin Token (server-side only, never exposed to client)
* Content Security Policy headers
* Rate Limiting on API routes
* Secure Headers (via `next.config.ts` headers)
* CSRF protection on form submissions

---

# Accessibility

* WCAG 2.2 Level AA
* Keyboard Navigation (full site navigable via keyboard)
* Screen Reader Support (semantic HTML, ARIA)
* Proper ARIA Labels (buttons, form inputs, modals)
* Color Contrast Compliance (4.5:1 minimum)
* Focus Management (modals, drawers, mega menu)
* Skip to Content link

---

# Analytics

* Google Analytics 4
* Shopify Analytics
* Conversion Tracking (purchase, add to cart, begin checkout)
* Enhanced Ecommerce (product impressions, clicks, detail views)
* Meta Pixel (PageView, ViewContent, AddToCart, Purchase)

---

# Error Tracking & Monitoring

* Sentry (error tracking, performance monitoring)
* Source maps uploaded to Sentry on deploy
* Custom error context (user ID, cart ID, product ID)
* Alert rules for error spikes
* Vercel Analytics (Web Vitals monitoring)

---

# Testing Strategy

## Unit Tests

* Vitest + React Testing Library
* Test utility functions, hooks, and component logic
* Coverage target: critical business logic (cart, wishlist, price formatting)

## End-to-End Tests

* Playwright
* Test critical user flows:
  * Browse → PDP → Add to Cart → Checkout redirect
  * Search → Filter → Product click
  * Login → Account → Order history
  * Wishlist add/remove
* Run in CI on every PR

## Visual Regression (Phase 2)

* Playwright screenshot comparisons or Chromatic
* Catch unintended UI changes

---

# CI/CD

## GitHub Actions

* **On PR:** Lint (ESLint) → Format check (Prettier) → Type check (tsc) → Unit tests (Vitest) → E2E tests (Playwright)
* **On merge to main:** Deploy to Vercel production
* **On PR create:** Vercel preview deployment (automatic)

## Linting & Formatting

* ESLint with `@next/eslint-plugin-next`
* Prettier
* Husky + lint-staged (pre-commit hooks)

---

# Content Strategy

## Shopify-Managed Content

* Product descriptions, images, variants
* Collection descriptions and images
* Blog posts (if added later)

## Code-Managed Content (Static Pages)

* About page
* FAQ page
* Shipping Policy
* Return Policy
* Privacy Policy
* Terms & Conditions

> These will be authored as MDX files in `content/` directory, allowing non-developer editing with a simple PR workflow. Migration to a headless CMS (e.g., Sanity, Contentful) is a future option.

## Dynamic Content

* Announcement bar text — Shopify metaobject or env variable
* Promotional banners — Shopify metaobject
* Newsletter — Klaviyo embedded form

---

# Future Enhancements

* Multi-language (i18n via Next.js internationalization + Shopify Markets)
* Multi-currency (Shopify Markets + `@inContext` directive)
* Loyalty Program
* Gift Cards
* Store Credit
* Subscription Products
* AI Product Recommendations
* AI Search (Algolia or similar)
* Live Chat (Intercom, Tidio, or similar)
* Mobile App (React Native)
* B2B Wholesale Portal
* Headless CMS migration (Sanity / Contentful)

---

# Folder Structure

```
fashion-sf/
├── app/
│   ├── (shop)/                    # Shop route group
│   │   ├── page.tsx               # Home page
│   │   ├── products/
│   │   │   ├── [handle]/
│   │   │   │   ├── page.tsx       # Product detail page
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   └── page.tsx           # Product listing / Shop page
│   │   ├── collections/
│   │   │   ├── [handle]/
│   │   │   │   └── page.tsx       # Collection page
│   │   │   └── page.tsx           # All collections
│   │   ├── search/
│   │   │   └── page.tsx           # Search results
│   │   ├── cart/
│   │   │   └── page.tsx           # Cart page
│   │   └── wishlist/
│   │       └── page.tsx           # Wishlist page
│   ├── (account)/                 # Protected route group
│   │   ├── layout.tsx             # Auth check layout
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── orders/
│   │   ├── addresses/
│   │   └── wishlist/
│   ├── (auth)/                    # Auth route group
│   │   ├── login/
│   │   └── callback/              # OAuth callback
│   ├── (info)/                    # Static info pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faq/
│   │   └── policies/
│   ├── api/                       # API routes
│   │   ├── wishlist/
│   │   ├── reviews/
│   │   └── revalidate/            # Webhook-triggered revalidation
│   ├── layout.tsx                 # Root layout
│   ├── not-found.tsx
│   ├── global-error.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/                    # Header, Footer, MegaMenu, AnnouncementBar
│   ├── product/                   # ProductCard, ProductGrid, ProductGallery
│   ├── cart/                      # CartDrawer, CartItem, CartSummary
│   ├── search/                    # SearchOverlay, SearchResults
│   ├── account/                   # AccountNav, OrderCard, AddressForm
│   └── shared/                    # Skeleton, ErrorBoundary, Toast
├── lib/
│   ├── shopify/
│   │   ├── client.ts              # Storefront & Admin API clients
│   │   ├── queries/               # GraphQL queries
│   │   ├── mutations/             # GraphQL mutations
│   │   ├── types.ts               # Generated types
│   │   └── utils.ts               # Helpers (flattenConnection, etc.)
│   ├── utils/                     # General utilities
│   └── constants.ts               # Site-wide constants
├── hooks/                         # Custom React hooks
├── stores/                        # Zustand stores (wishlist, UI)
├── content/                       # MDX files for static pages
├── types/                         # Global TypeScript types
├── styles/                        # Global styles, Tailwind config
├── public/                        # Static assets (favicon, OG images)
├── tests/
│   ├── unit/                      # Vitest unit tests
│   └── e2e/                       # Playwright E2E tests
└── .github/
    └── workflows/                 # CI/CD pipelines
```

---

# Phased Delivery Plan

## Phase 1 — MVP (Core Shopping Experience)

* Home page (Hero, Featured Collections, New Arrivals, Best Sellers, Newsletter)
* Product listing page (filters, sorting, pagination)
* Product detail page (gallery, variants, add to cart, buy now)
* Shopping cart (full CRUD, discount codes)
* Shopify Checkout integration
* Search (instant search, predictive search)
* Header & Footer (mega menu, mobile nav)
* Wishlist (localStorage for guests)
* SEO (metadata, structured data, sitemap, robots)
* Loading & error states (skeletons, error boundaries)
* Responsive design (mobile, tablet, desktop)
* Vercel deployment

## Phase 2 — Accounts & Social Proof

* Customer authentication (Shopify Customer Account API)
* Customer account pages (dashboard, profile, orders, addresses)
* Wishlist sync (metafields for logged-in users)
* Reviews integration (Judge.me)
* Home page additions (Trending, Flash Sale, Brand Story, Reviews)
* Analytics setup (GA4, Meta Pixel, Clarity)
* Error tracking (Sentry)
* Testing setup (Vitest + Playwright)
* CI/CD pipeline (GitHub Actions)

## Phase 3 — Polish & Enhancements

* Instagram Gallery (Behold/Elfsight)
* Featured Categories (home page)
* Wishlist sharing
* Visual regression tests
* Currency selector (Shopify Markets ready)
* Performance optimization pass
* Accessibility audit
* Content strategy finalization (MDX or CMS decision)

---

# Deliverables

* Fully responsive headless Shopify storefront
* Shopify backend configuration
* Product and collection integration
* Customer authentication (OAuth)
* Wishlist functionality (guest + synced)
* Search and filtering
* Shopping cart and Shopify Checkout integration
* SEO optimization (metadata, structured data, sitemap)
* Performance optimization
* Analytics setup (GA4, Meta Pixel, Clarity)
* Error tracking (Sentry)
* Testing suite (unit + E2E)
* CI/CD pipeline
* Production deployment on Vercel
* Technical documentation
* Environment configuration guide
* Deployment guide

---

# Success Criteria

* Lighthouse Performance Score ≥ 95
* SEO Score ≥ 95
* Accessibility Score ≥ 95
* Best Practices Score ≥ 95
* Fully responsive across mobile, tablet, and desktop
* Fast product search and filtering
* Seamless Shopify checkout experience
* Scalable and maintainable codebase
* Clean UI with modern clothing brand aesthetics
* All critical user flows covered by E2E tests
* Zero unhandled errors in production (Sentry clean)
