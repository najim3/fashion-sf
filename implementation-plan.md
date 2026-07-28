# Headless Clothing E-commerce Store — Implementation Plan

Build a premium, high-performance headless clothing e-commerce website using **Next.js 16 (App Router)** as the frontend and **Shopify** as the backend via the **Storefront API (GraphQL)**, **Admin API**, and **Customer Account API**.

---

## Prerequisites & Open Questions

> [!IMPORTANT]
> **Shopify Store Setup Required Before Development:**
>
> - Products, variants, and collections created in Shopify Admin
> - Storefront API access token generated (via the Headless channel)
> - Admin API access token (server-side wishlist metafields — Phase 2)
> - Customer Account API configured (OAuth login — Phase 2)
> - Judge.me installed and API key obtained (Phase 2)

> [!WARNING]
> **Key Technical Decisions:**
>
> - **Next.js 16 + Tailwind CSS v4** — CSS-first configuration via `@theme` directives in `globals.css` (no `tailwind.config.ts`)
> - **`@shopify/hydrogen-react`** — Used within Next.js (NOT full Hydrogen/Remix stack) for `ShopifyProvider`, `CartProvider`, `Image`, `Money`, `flattenConnection`
> - **Storefront API version**: `2026-04` (latest stable)

### Open Questions

1. Do you already have a Shopify store set up, or should the plan include store provisioning steps?
2. Do you have existing brand guidelines (colors, typography, logo) or should we create a design system from scratch?
3. Is there already a Vercel project linked to this repo?
4. Is Judge.me already installed on the Shopify store?
5. Is there an existing Klaviyo account for newsletter integration?

---

---

# Phase 1 — MVP (Core Shopping Experience)

> Deliver a fully functional headless storefront with browsing, product details, cart, search, wishlist (guest), and checkout redirect.

---

## Sub-Phase 1.1 — Project Scaffolding & Configuration

Initialize the Next.js 16 project, install dependencies, and configure tooling.

### Files

#### [NEW] Project initialization

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

#### [NEW] package.json — Additional dependencies

```
# Shopify
@shopify/hydrogen-react
@shopify/storefront-api-client
@shopify/api-codegen-preset (devDep)

# UI & Styling
shadcn (init via CLI)
framer-motion
lucide-react
clsx
tailwind-merge
embla-carousel-react

# State Management
zustand

# Forms & Validation
react-hook-form
@hookform/resolvers
zod

# Dev Tooling
prettier
eslint-config-prettier
husky
lint-staged
```

#### [NEW] .env.local

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION=2026-04
SHOPIFY_ADMIN_ACCESS_TOKEN=xxxxx          # server-side ONLY
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### [NEW] app/globals.css

Tailwind CSS v4 CSS-first configuration with custom `@theme` tokens — color palette, typography (Inter + Outfit via Google Fonts), spacing, shadows, animations.

#### [NEW] next.config.ts

- Shopify CDN image domain allowlist (`cdn.shopify.com`)
- Security headers (CSP, X-Frame-Options, Referrer-Policy, etc.)
- Remote image patterns for product media

#### [NEW] lib/constants.ts

Site-wide constants: site name, navigation structure, social links, revalidation intervals, pagination defaults.

### Verify

- [ ] Project scaffolds successfully, Tailwind config compiles without errors, and dev server starts.

---

## Sub-Phase 1.2 — Shopify Data Layer

Core API client, GraphQL queries/mutations, type generation, and utility functions.

### Files

#### [NEW] lib/shopify/client.ts

- `createStorefrontApiClient()` from `@shopify/storefront-api-client`
- Centralized `shopifyFetch<T>()` wrapper with:
  - Retry logic (3 attempts, exponential backoff)
  - Throttle handling via `throttleStatus` from response extensions
  - Typed error handling (`ShopifyApiError` class)
  - `React.cache()` wrapping for request-level deduplication
- Separate `adminFetch<T>()` for server-side Admin API calls (used in Phase 2)

#### [NEW] lib/shopify/queries/products.ts

- `getProducts(sortKey, reverse, query, first, after)` — paginated product list
- `getProductByHandle(handle)` — single product with all variants, images, metafields
- `getProductRecommendations(productId)` — related products

#### [NEW] lib/shopify/queries/collections.ts

- `getCollections(first)` — all collections
- `getCollectionByHandle(handle)` — collection with nested products (filterable)
- `getCollectionProducts(handle, sortKey, reverse, filters, first, after)` — paginated

#### [NEW] lib/shopify/queries/search.ts

- `predictiveSearch(query, types)` — instant search via Shopify Predictive Search API

#### [NEW] lib/shopify/queries/shop.ts

- `getShopInfo()` — store name, description, brand settings

#### [NEW] lib/shopify/mutations/cart.ts

- `cartCreate(lines)` — creates cart → returns `cart.id` + `cart.checkoutUrl`
- `cartLinesAdd(cartId, lines)` — adds merchandise via variant GID
- `cartLinesUpdate(cartId, lines)` — updates quantity by line item ID
- `cartLinesRemove(cartId, lineIds)` — removes lines
- `cartDiscountCodesUpdate(cartId, discountCodes)` — applies/removes discount codes
- `cartNoteUpdate(cartId, note)` — updates cart note
- `cartBuyerIdentityUpdate(cartId, buyerIdentity)` — links buyer to cart

#### [NEW] lib/shopify/types.ts

Auto-generated types from Shopify GraphQL schema via `@shopify/api-codegen-preset` plus manual helper types (`ShopifyProduct`, `ShopifyCollection`, `ShopifyCart`, `ShopifyImage`, etc.).

#### [NEW] lib/shopify/utils.ts

- Re-export `flattenConnection()` from `@shopify/hydrogen-react`
- `getProductUrl(handle)` → `/products/[handle]`
- `getCollectionUrl(handle)` → `/collections/[handle]`
- `shopifyImageLoader({ src, width })` — custom Next.js image loader for Shopify CDN

### Verify

- [ ] Shopify Storefront API client connects and fetches basic store data (e.g., products, collections).

---

## Sub-Phase 1.3 — Root Layout & Providers

App shell with global providers, fonts, and metadata.

### Files

#### [NEW] app/layout.tsx

- `ShopifyProvider` from `@shopify/hydrogen-react` (global config: storeDomain, storefrontToken, apiVersion, countryIsoCode, languageIsoCode)
- `CartProvider` from `@shopify/hydrogen-react` (cart state management)
- Google Fonts: Inter (body) + Outfit (display) via `next/font/google`
- Global CSS import
- Default metadata via `export const metadata`
- Toast provider (Sonner)
- Skip-to-content link

#### [NEW] app/not-found.tsx

Custom 404 page with branded design, search link, popular collections, and home CTA.

#### [NEW] app/global-error.tsx

Global error boundary with retry button and graceful fallback UI.

#### [NEW] app/sitemap.ts

Dynamic XML sitemap — fetches all products and collections from Storefront API.

#### [NEW] app/robots.ts

Robots.txt with sitemap reference and standard crawl directives.

### Verify

- [ ] Root layout renders without errors and providers (Shopify, Cart, Fonts, Toast) are injected.

---

## Sub-Phase 1.4 — Layout Components (Header & Footer)

Persistent layout components shared across all pages.

### Files

#### [NEW] components/layout/header.tsx

Sticky header with:

- Logo (links to home)
- Mega menu trigger (desktop)
- Search icon → opens search overlay
- Wishlist icon with count badge (from Zustand store)
- Account icon (links to login or dashboard)
- Cart icon with count badge (from `useCart()` hook)
- Responsive: collapses to hamburger on mobile

#### [NEW] components/layout/mega-menu.tsx

Desktop mega menu (Framer Motion animated):

- Collection-based navigation with images
- Multi-column layout
- Triggered on hover with delay

#### [NEW] components/layout/mobile-nav.tsx

Full-screen mobile navigation drawer:

- Slide-in from left (Framer Motion)
- Accordion sub-menus for collections
- Close on navigation or backdrop click

#### [NEW] components/layout/announcement-bar.tsx

Top-of-page dismissible announcement bar:

- Configurable text from environment variable or Shopify metaobject
- Smooth dismiss animation

#### [NEW] components/layout/footer.tsx

Footer with:

- Navigation columns (Shop, Customer Service, Company, Legal)
- Newsletter signup form
- Social media links
- Payment method icons
- Copyright notice

### Verify

- [ ] Header/footer layout is responsive, mega-menu opens, and mobile drawer toggles.

---

## Sub-Phase 1.5 — Home Page

Landing page with hero and curated product sections.

### Files

#### [NEW] app/(shop)/page.tsx

Home page Server Component:

- `generateMetadata` with site-level SEO
- Organization JSON-LD structured data
- Fetches data from Storefront API: featured collections, new arrivals, best sellers

#### [NEW] components/home/hero-banner.tsx

Full-width hero section:

- Background image/video
- Headline + subtext + CTA button
- Animated entrance (Framer Motion)
- Responsive sizing

#### [NEW] components/home/featured-collections.tsx

Grid of 4 collection cards (Men, Women, Kids, Accessories):

- Collection image + title + "Shop Now" link
- Data: `collections(first: 4)` Storefront API query

#### [NEW] components/home/new-arrivals.tsx

Horizontal product carousel:

- Uses `embla-carousel-react`
- Data: `products(sortKey: CREATED_AT, reverse: true, first: 8)`
- Auto-scroll with manual navigation arrows

#### [NEW] components/home/best-sellers.tsx

Product grid (2×4 desktop, 2×2 mobile):

- Data: `products(sortKey: BEST_SELLING, first: 8)`

#### [NEW] components/home/newsletter-signup.tsx

Email signup section:

- React Hook Form + Zod validation
- Klaviyo embed form or custom API integration
- Success/error feedback

#### [NEW] app/(shop)/loading.tsx

Home page skeleton loading state.

### Verify

- [x] Home page sections render with correct mocked or API data (featured collections, carousels).

---

## Sub-Phase 1.6 — Shared Product Components

Reusable product display components used across multiple pages.

### Files

#### [NEW] components/product/product-card.tsx

Product card with:

- Product image (next/image with Shopify CDN loader)
- Title, vendor (brand), price (using `Money` from `@shopify/hydrogen-react`)
- Compare-at-price with discount badge
- Quick-add-to-cart button
- Wishlist heart icon toggle
- Hover: secondary image swap + scale animation

#### [NEW] components/product/product-grid.tsx

Responsive CSS Grid layout:

- 2 columns mobile / 3 tablet / 4 desktop
- Accepts `products` array and renders `ProductCard` for each

#### [NEW] components/shared/skeleton.tsx

Skeleton UI components:

- `ProductCardSkeleton`
- `ProductGridSkeleton`
- `ProductGallerySkeleton`
- `TextBlockSkeleton`

### Verify

- [x] Product card displays correctly (image, title, price) and skeleton states show during loading.

---

## Sub-Phase 1.7 — Product Listing Page (Shop & Collections)

Browsing pages with filtering, sorting, and pagination.

### Files

#### [NEW] app/(shop)/products/page.tsx

Shop page (all products):

- `generateMetadata` with "Shop All" title
- URL-based filter/sort state via `searchParams`
- Server-side data fetching with Storefront API `products` query

#### [NEW] app/(shop)/products/loading.tsx

Shop page skeleton.

#### [NEW] app/(shop)/collections/page.tsx

All collections page:

- Grid of collection cards with images
- Data: `collections(first: 50)` query

#### [NEW] app/(shop)/collections/[handle]/page.tsx

Collection detail page:

- `generateMetadata` with collection name
- Products within collection with filtering
- Data: `collection(handle)` with nested `products` connection
- ISR: `export const revalidate = 60`

#### [NEW] app/(shop)/collections/[handle]/loading.tsx

Collection page skeleton.

#### [NEW] components/product/product-filters.tsx

Filter sidebar (desktop) / drawer (mobile):

- Category, Size, Color (swatches), Price Range (slider), Availability, Material, Gender, On Sale toggle
- URL-based state via `searchParams` (SSR-friendly, shareable URLs)
- "Clear All" and per-filter clear buttons

#### [NEW] components/product/product-sort.tsx

Sort dropdown:

- Featured, Newest, Price Low→High, Price High→Low, Best Selling
- Maps to Storefront API `sortKey` + `reverse` params

#### [NEW] components/product/pagination.tsx

Cursor-based pagination:

- Uses Storefront API `after`/`before` cursors
- `pageInfo.hasNextPage` / `hasPreviousPage`
- "Load More" button or numbered pages

### Verify

- [x] Collection pages load products, and filter/sorting logic updates results via URL params.

---

## Sub-Phase 1.8 — Product Detail Page (PDP)

Individual product page with gallery, variants, and purchase actions.

### Files

#### [NEW] app/(shop)/products/[handle]/page.tsx

PDP Server Component:

- `generateMetadata` — product title, description, OG image (first product image)
- Product JSON-LD structured data (`Product` schema with `offers`, `brand`, `image`)
- Breadcrumb JSON-LD (`BreadcrumbList`)
- ISR: `export const revalidate = 60`
- Data: `product(handle)` Storefront API query with all variants, images, metafields

#### [NEW] app/(shop)/products/[handle]/loading.tsx

PDP skeleton loading state.

#### [NEW] app/(shop)/products/[handle]/error.tsx

PDP error boundary with retry button.

#### [NEW] components/product/product-gallery.tsx

Image gallery:

- Main image with zoom-on-hover (CSS transform)
- Thumbnail strip (click to select)
- Mobile: swipeable carousel (embla-carousel)
- Video support (renders `<video>` for Shopify video media)

#### [NEW] components/product/variant-selector.tsx

Variant selection:

- Color swatches (visual circles with border on selected)
- Size selector (button group with disabled state for unavailable)
- Updates URL, price, availability, SKU, and gallery image based on selected variant
- Maps variant `selectedOptions` to option combinations

#### [NEW] components/product/add-to-cart.tsx

Purchase section:

- Quantity selector (+/- buttons)
- **"Add to Cart"** — calls `useCart().linesAdd()` → shows toast confirmation
- **"Buy Now"** — creates single-item cart → redirects to `checkoutUrl`
- **"Add to Wishlist"** toggle
- Stock status: `quantityAvailable` display, disabled button when out of stock
- SKU display

#### [NEW] components/product/product-details-tabs.tsx

Tabbed or accordion section:

- Description (HTML from Shopify)
- Size Guide
- Materials & Care Instructions
- Shipping Information
- Return Policy

#### [NEW] components/product/related-products.tsx

Related products carousel:

- Data: `productRecommendations(productId)` Storefront API query
- Renders `ProductCard` components in horizontal scroll

### Verify

- [x] Product Detail Page renders images, variant selector works, and 'Add to Cart' interacts with the cart provider.

---

## Sub-Phase 1.9 — Shopping Cart

Cart drawer and full cart page with checkout redirect.

### Files

#### [NEW] components/cart/cart-drawer.tsx

Slide-out cart drawer (triggered from header icon):

- Cart line items list
- Animated entrance/exit (Framer Motion — slide from right)
- Backdrop overlay
- Empty cart state with "Continue Shopping" CTA
- Uses `useCart()` from `@shopify/hydrogen-react`

#### [NEW] components/cart/cart-item.tsx

Individual cart line item:

- Product image thumbnail
- Title + variant info (size, color)
- Quantity controls (+/- buttons) — calls `useCart().linesUpdate()`
- Remove button — calls `useCart().linesRemove()`
- Line price using `Money` component
- Loading state during mutations

#### [NEW] components/cart/cart-summary.tsx

Order summary:

- Subtotal, estimated taxes, estimated shipping, total (from `cart.cost`)
- Discount code input — calls `useCart().discountCodesUpdate()`
- Applied discounts display
- "Continue Shopping" link
- **"Checkout"** button → redirects to `cart.checkoutUrl` (Shopify-hosted checkout)

#### [NEW] app/(shop)/cart/page.tsx

Full cart page (Client Component):

- Full-width cart layout (items on left, summary on right)
- Uses same `CartItem` and `CartSummary` components
- Empty state with featured products suggestion

### Verify

- [x] Cart drawer opens/closes, line items can be updated/removed, and checkout URL works.

---

## Sub-Phase 1.10 — Search

Instant search overlay and search results page.

### Files

#### [NEW] components/search/search-overlay.tsx

Modal/full-screen search overlay:

- Debounced input (300ms)
- Predictive search results via `predictiveSearch` Storefront API query
- Product suggestions with thumbnails + price
- Collection suggestions
- Recent searches (localStorage, max 5 items)
- Keyboard navigation (↑/↓ arrows + Enter)
- Close on Escape or backdrop click

#### [NEW] app/(shop)/search/page.tsx

Search results page:

- Full results via `products(query: searchParams.q)` Storefront API query
- Product grid with filters and sorting
- "No results" state with suggestions

#### [NEW] app/(shop)/search/loading.tsx

Search results skeleton.

### Verify

- [x] Search overlay opens, debounces input, and predictive results load from API.

---

## Sub-Phase 1.11 — Wishlist (Guest — localStorage)

Client-side wishlist using Zustand with localStorage persistence.

### Files

#### [NEW] stores/wishlist-store.ts

Zustand store with `persist` middleware:

- `items: string[]` — array of product GIDs
- `addItem(id)`, `removeItem(id)`, `toggleItem(id)`
- `isInWishlist(id)` — boolean check
- `itemCount` — derived count for badge

#### [NEW] app/(shop)/wishlist/page.tsx

Wishlist page:

- Fetches product details by GIDs via Storefront API `nodes(ids)` query
- Renders products in grid
- "Move to Cart" action per item
- Empty state with "Start Shopping" CTA

#### [NEW] components/product/wishlist-button.tsx

Heart icon toggle button:

- Filled heart when in wishlist, outlined when not
- Animated toggle (Framer Motion scale)
- Used on `ProductCard` and PDP `AddToCart` section

### Verify

- [x] Adding items to wishlist updates local state, badge count, and wishlist page list.

---

## Sub-Phase 1.12 — Static Info Pages

Policy and informational pages from MDX content files.

### Files

#### [NEW] content/about.mdx

#### [NEW] content/faq.mdx

#### [NEW] content/shipping-policy.mdx

#### [NEW] content/return-policy.mdx

#### [NEW] content/privacy-policy.mdx

#### [NEW] content/terms.mdx

MDX content files authored as markdown with optional React components.

#### [NEW] app/(info)/about/page.tsx

#### [NEW] app/(info)/contact/page.tsx

#### [NEW] app/(info)/faq/page.tsx

#### [NEW] app/(info)/policies/shipping/page.tsx

#### [NEW] app/(info)/policies/returns/page.tsx

#### [NEW] app/(info)/policies/privacy/page.tsx

#### [NEW] app/(info)/policies/terms/page.tsx

Each page:

- Renders corresponding MDX file
- `generateMetadata` with page-specific title/description
- Statically generated at build time (`export const dynamic = 'force-static'`)

### Verify

- [x] Static MDX pages (about, policies) render correctly via Next.js static generation.

---

## Sub-Phase 1.13 — SEO & Structured Data

Centralized SEO utilities and structured data generation.

### Files

#### [NEW] lib/seo.ts

SEO helper functions:

- `generateProductJsonLd(product)` — `Product` schema with `offers`, `image`, `brand`, `sku`
- `generateBreadcrumbJsonLd(items)` — `BreadcrumbList` schema
- `generateOrganizationJsonLd()` — `Organization` schema
- `generateCollectionJsonLd(collection)` — `CollectionPage` schema
- OG image URL builder for products/collections

### Verify

- [x] SEO metadata and JSON-LD structured data exist correctly in the page source.

---

## Sub-Phase 1.14 — Loading & Error States

Consistent loading and error handling across all routes.

### Files

#### [NEW] components/shared/error-boundary.tsx

Reusable error component:

- Error message display
- "Try Again" retry button
- "Go Home" fallback link

#### [NEW] components/shared/toast.tsx

Toast notification system (via Sonner):

- Success (added to cart, added to wishlist)
- Error (API failures, network errors)
- Info (item removed, discount applied)

#### Loading files per route segment

- `app/(shop)/loading.tsx`
- `app/(shop)/products/loading.tsx`
- `app/(shop)/products/[handle]/loading.tsx`
- `app/(shop)/collections/[handle]/loading.tsx`
- `app/(shop)/search/loading.tsx`

#### Error files per route segment

- `app/(shop)/products/[handle]/error.tsx`

### Verify

- [x] Error boundaries catch exceptions gracefully and toast notifications fire successfully.

---

---

# Phase 2 — Accounts & Social Proof

> Add customer authentication, account management, wishlist sync, reviews, analytics, and testing.

---

## Sub-Phase 2.1 — Customer Authentication (Shopify Customer Account API)

OAuth 2.0 + PKCE authentication flow for customer login.

### Files

#### [NEW] lib/shopify/auth.ts

Customer Account API implementation:

- `generateCodeVerifier()` + `generateCodeChallenge()` — PKCE helpers
- `generateAuthUrl(redirectUri, state, codeChallenge)` — builds Shopify Customer Account login URL
- `exchangeCodeForToken(code, codeVerifier, redirectUri)` — exchanges auth code for access/refresh tokens
- `refreshAccessToken(refreshToken)` — refreshes expired token
- `getCustomerAccessToken(request)` — reads token from session cookie
- Session cookie management (HTTP-only, secure, SameSite=Lax)

#### [NEW] app/(auth)/login/page.tsx

Login page:

- Generates PKCE challenge
- Stores code verifier in server-side session
- Redirects to Shopify Customer Account login URL

#### [NEW] app/(auth)/callback/page.tsx

OAuth callback handler:

- Validates `state` parameter (CSRF protection)
- Exchanges authorization code for access token
- Sets session cookie
- Redirects to `/account/dashboard` or previous page

#### [NEW] app/api/auth/[...route]/route.ts

Auth API routes:

- `POST /api/auth/login` — initiates OAuth flow
- `GET /api/auth/callback` — handles callback
- `POST /api/auth/refresh` — refreshes token
- `POST /api/auth/logout` — clears session

#### [NEW] proxy.ts

Next.js Middleware (Proxy):

- Intercepts `/account/*` routes
- Checks for valid session cookie
- Redirects unauthenticated users to `/login?redirect=<current_path>`
- Forwards customer access token via request headers for Server Components

### Verify

- [ ] Customer login flow with OAuth PKCE succeeds and secure session cookie is set.

---

## Sub-Phase 2.2 — Customer Account Pages

Protected account management pages.

### Files

#### [NEW] app/(account)/layout.tsx

Account layout:

- Sidebar navigation (dashboard, profile, orders, addresses, wishlist, returns)
- Auth check via layout (reads session)
- Responsive: sidebar collapses to top nav on mobile

#### [NEW] app/(account)/dashboard/page.tsx

Dashboard overview:

- Recent orders (last 5)
- Profile summary
- Quick action links
- Data: Customer Account API `customer` query

#### [NEW] app/(account)/profile/page.tsx

Profile management:

- Edit name, email, phone
- React Hook Form + Zod validation
- Data: Customer Account API `customer` query + `customerUpdate` mutation

#### [NEW] app/(account)/orders/page.tsx

Order history:

- Paginated order list with status badges (Pending, Fulfilled, Cancelled)
- Data: Customer Account API `orders` query

#### [NEW] app/(account)/orders/[id]/page.tsx

Order detail view:

- Line items with images and prices
- Shipping address and method
- Payment summary
- Fulfillment tracking info

#### [NEW] app/(account)/addresses/page.tsx

Saved addresses:

- List all addresses
- Add / Edit / Delete actions
- Set default address
- Data: Customer Account API address queries/mutations

#### [NEW] components/account/account-nav.tsx

Account sidebar navigation component.

#### [NEW] components/account/order-card.tsx

Order summary card for dashboard and order list.

#### [NEW] components/account/address-form.tsx

Address add/edit form (React Hook Form + Zod).

#### [NEW] components/account/profile-form.tsx

Profile edit form.

### Verify

- [ ] Customer account dashboard, profile updates, and order history pages load correctly.

---

## Sub-Phase 2.3 — Wishlist Sync (Customer Metafields)

Sync guest wishlist to customer account via Shopify Admin API metafields.

### Files

#### [NEW] app/api/wishlist/route.ts

Server-side API route for wishlist CRUD:

- `GET /api/wishlist` — reads customer metafield (JSON array of product IDs) via Admin API
- `POST /api/wishlist` — adds product ID to metafield array
- `DELETE /api/wishlist` — removes product ID from metafield array
- Authenticated: reads customer ID from session

#### [MODIFY] stores/wishlist-store.ts

Extend Zustand store:

- `syncFromServer(customerId)` — fetches metafield data, merges with localStorage
- `syncToServer(customerId)` — pushes current state to metafield
- Optimistic updates (immediate UI update, async server sync)
- Error recovery: revert to previous state on API failure

#### [NEW] app/(account)/wishlist/page.tsx

Account wishlist page:

- Displays synced wishlist from metafields
- "Move to Cart" per item
- "Remove" per item

### Verify

- [ ] Guest wishlist merges with server data, and syncs to customer metafield on changes.

---

## Sub-Phase 2.4 — Reviews Integration (Judge.me)

Product reviews via Judge.me Public API.

### Files

#### [NEW] lib/judgeme.ts

Judge.me API client:

- `getProductReviews(externalId, page, perPage)` — paginated reviews
- `getAverageRating(externalId)` — aggregate rating
- `submitReview(productId, { name, email, rating, title, body })` — submit review
- Response type definitions

#### [NEW] components/product/reviews-section.tsx

Reviews display (on PDP):

- Aggregate star rating + review count
- Review list with pagination
- Sort by: Newest, Highest, Lowest
- Individual review: name, date, star rating, title, body

#### [NEW] components/product/review-form.tsx

Review submission form:

- Star rating input (clickable stars)
- Name, email, title, body fields
- React Hook Form + Zod validation
- Success/error feedback

#### [NEW] components/product/star-rating.tsx

Reusable star rating component:

- Display mode (read-only, fractional stars)
- Input mode (clickable, full stars)

#### [NEW] app/api/reviews/route.ts

API route proxy:

- `POST /api/reviews` — forwards review submission to Judge.me (hides API key server-side)
- Input validation via Zod

### Verify

- [ ] Judge.me reviews load on PDP, aggregate rating displays, and review submission works.

---

## Sub-Phase 2.5 — Home Page Additions

Additional home page sections for Phase 2.

### Files

#### [NEW] components/home/trending-products.tsx

Trending products section:

- Curated via Shopify collection tagged "trending" or manual metaobject
- Product carousel

#### [NEW] components/home/flash-sale.tsx

Flash sale section:

- Countdown timer (target date configurable)
- Discounted products grid
- Urgency UI (red accents, timer)

#### [NEW] components/home/brand-story.tsx

Brand story section:

- Image + text layout
- Parallax or scroll-triggered animation

#### [NEW] components/home/testimonials.tsx

Customer testimonials carousel:

- Fetched from Judge.me or static content
- Star rating + quote + customer name

#### [MODIFY] app/(shop)/page.tsx

Add Phase 2 sections below existing MVP sections.

### Verify

- [ ] New home page sections (trending, flash sale countdown, testimonials) render properly.

---

## Sub-Phase 2.6 — Analytics & Error Tracking

Third-party analytics and monitoring integration.

### Files

#### [NEW] components/analytics/analytics-provider.tsx

Client Component wrapping analytics scripts:

- Google Analytics 4 (`gtag.js`) — loaded via `next/script`
- Meta Pixel (`fbevents.js`) — loaded via `next/script`
- Microsoft Clarity — loaded via `next/script`
- Consent-aware: only loads after consent (future cookie banner)

#### [NEW] lib/analytics.ts

Analytics event tracking:

- `trackPageView(url)` — GA4 + Meta Pixel `PageView`
- `trackViewProduct(product)` — GA4 `view_item` + Meta Pixel `ViewContent`
- `trackAddToCart(product, quantity)` — GA4 `add_to_cart` + Meta Pixel `AddToCart`
- `trackRemoveFromCart(product)` — GA4 `remove_from_cart`
- `trackBeginCheckout(cart)` — GA4 `begin_checkout` + Meta Pixel `InitiateCheckout`
- `trackSearch(query)` — GA4 `search`

#### [NEW] Sentry integration

- Install `@sentry/nextjs`
- `sentry.client.config.ts` — client-side error tracking
- `sentry.server.config.ts` — server-side error tracking
- `sentry.edge.config.ts` — edge runtime error tracking
- `next.config.ts` update for Sentry webpack plugin (source map upload)
- Custom error context: user ID, cart ID, product handle

### Verify

- [ ] Tracking scripts (GA4, Meta) trigger events and Sentry captures test errors with context.

---

## Sub-Phase 2.7 — Testing & CI/CD

Unit tests, E2E tests, and continuous integration pipeline.

### Files

#### [NEW] vitest.config.ts

Vitest configuration with React Testing Library support, path aliases, and coverage settings.

#### [NEW] tests/unit/shopify-client.test.ts

- API client error handling
- Retry logic (exponential backoff)
- Throttle handling

#### [NEW] tests/unit/wishlist-store.test.ts

- Zustand store add/remove/toggle actions
- Persistence (localStorage mock)

#### [NEW] tests/unit/utils.test.ts

- `flattenConnection`, URL builders, image loader

#### [NEW] tests/unit/product-card.test.tsx

- Renders product data correctly
- Wishlist toggle behavior
- Price formatting with `Money` component

#### [NEW] playwright.config.ts

Playwright configuration with base URL, browser configs, and screenshot settings.

#### [NEW] tests/e2e/browse-to-checkout.spec.ts

- Navigate to shop → click product → select variant → add to cart → open cart → click checkout → verify Shopify checkout redirect

#### [NEW] tests/e2e/search-and-filter.spec.ts

- Open search → type query → click suggestion → verify PDP
- Apply filter → verify results update → clear filter

#### [NEW] tests/e2e/wishlist.spec.ts

- Add to wishlist from PDP → verify badge count → go to wishlist page → remove item

#### [NEW] tests/e2e/account-flow.spec.ts

- Login → verify dashboard → view orders → view profile

#### [NEW] .github/workflows/ci.yml

GitHub Actions pipeline:

- **On PR**: Lint (ESLint) → Format (Prettier) → Type check (tsc) → Unit tests (Vitest) → E2E tests (Playwright)
- **On merge to main**: Deploy to Vercel production

#### [NEW] .husky/pre-commit

Husky pre-commit hook: runs `lint-staged` (ESLint + Prettier on staged files).

### Verify

- [ ] Unit tests and E2E Playwright tests run locally and pass successfully.

---

## Sub-Phase 2.8 — Webhook-Triggered ISR

On-demand revalidation via Shopify webhooks.

### Files

#### [NEW] app/api/revalidate/route.ts

Webhook handler:

- Validates Shopify webhook HMAC signature (security)
- Handles topics: `products/update`, `products/create`, `products/delete`, `collections/update`, `inventory_levels/update`
- Calls `revalidatePath()` for affected product/collection pages
- Calls `revalidateTag()` for tagged data (products list, collections list)
- Returns 200 OK to Shopify

### Verify

- [ ] Webhook endpoint validates Shopify HMAC and successfully calls revalidate logic.

---

---

# Phase 3 — Polish & Enhancements

> Final polish, performance optimization, accessibility compliance, and advanced features.

---

## Sub-Phase 3.1 — Additional Features

#### [NEW] components/home/instagram-gallery.tsx

Instagram feed embed via Behold or Elfsight widget on home page.

#### [NEW] components/home/featured-categories.tsx

Visual category grid on home page — large image tiles linking to filtered product views.

#### [NEW] Wishlist sharing

Generate a shareable URL containing wishlist product IDs (encoded in URL params or short-link service).

#### [NEW] components/layout/currency-selector.tsx

Currency/country selector UI:

- Dropdown in header
- Uses Shopify Markets + `@inContext` Storefront API directive
- Persists selection in cookie

### Verify

- [ ] Instagram gallery loads, wishlist sharing URL works, and currency selector persists choice.

---

## Sub-Phase 3.2 — Performance Optimization

- Lighthouse Performance audit → target ≥ 95
- Bundle analysis with `@next/bundle-analyzer`
- Image optimization: WebP format, responsive `sizes`, lazy loading below fold
- Font subsetting (Inter + Outfit — Latin subset only)
- Code splitting: `dynamic()` imports for heavy components (gallery, carousel, search overlay)
- Critical CSS extraction
- Preconnect to Shopify CDN (`cdn.shopify.com`)
- Prefetch key navigation routes

### Verify

- [ ] Lighthouse performance scores meet targets and bundle analyzer shows optimized chunks.

---

## Sub-Phase 3.3 — Accessibility Audit

- WCAG 2.2 Level AA compliance check
- Keyboard navigation: all interactive elements focusable and operable
- Screen reader: semantic HTML, ARIA labels on buttons/forms/modals
- Color contrast: 4.5:1 minimum for all text
- Focus management: trap focus in modals/drawers, restore on close
- Skip-to-content link (already in root layout)
- Reduced motion: respect `prefers-reduced-motion` in Framer Motion animations
- Form accessibility: labels, error messages linked via `aria-describedby`

### Verify

- [ ] Keyboard navigation works end-to-end and screen reader reads out interactive elements.

---

## Sub-Phase 3.4 — Visual Regression Testing

- Playwright screenshot comparisons for key pages (home, PDP, cart, search, account)
- Baseline snapshot generation
- CI integration: compare screenshots on PR, flag visual diffs
- Or: Chromatic (Storybook-based) if component library warrants it

### Verify

- [ ] Visual regression baseline tests pass without unintended layout shifts or diffs.

---

---

# Verification Plan

## Automated Tests

```bash
# Type checking
npx tsc --noEmit

# Linting
npx eslint . --ext .ts,.tsx

# Unit tests
npx vitest run

# E2E tests
npx playwright test

# Build verification
npm run build
```

## Manual Verification

| Check                     | Target                                            |
| ------------------------- | ------------------------------------------------- |
| Lighthouse Performance    | ≥ 95                                              |
| Lighthouse SEO            | ≥ 95                                              |
| Lighthouse Accessibility  | ≥ 95                                              |
| Lighthouse Best Practices | ≥ 95                                              |
| Cross-browser             | Chrome, Firefox, Safari, Edge                     |
| Responsive                | 375px (mobile), 768px (tablet), 1280px+ (desktop) |
| Shopify integration       | Product data, cart CRUD, checkout redirect        |
| User flows                | Browse → PDP → Cart → Checkout (end-to-end)       |
| Error scenarios           | API unavailable, network timeout, invalid routes  |

## Deployment Verification

- Vercel preview deployment per PR (automatic)
- Production deployment on merge to main
- Sentry monitoring: zero unhandled errors post-deploy
- Vercel Analytics: Web Vitals within targets
