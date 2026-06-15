# Onefinity — HTML + Tailwind + Alpine front-end

A static, mobile-first rebuild of the Onefinity CNC storefront using **only** HTML,
Tailwind CSS (Play CDN) and Alpine.js. One HTML file per page, shared chrome and
data factored into `assets/`. Everything runs by opening any `.html` file directly —
no build step, no server.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `collection.html` | Shop / Accessories (`?c=acc` filter) |
| `product.html` | Product detail (`?id=woodworker`) |
| `cart.html` | Cart |
| `checkout.html` | 3-step checkout |
| `order-confirmation.html` | Order confirmation |
| `build.html` | **Build Your CNC** configurator (full wizard + live preview) |
| `blog.html` · `events.html` · `faq.html` | Content / support |
| `login.html` · `account.html` | Account |
| `about.html` · `community.html` · `projects.html` · `podcast.html` | Company / content |
| `contact.html` · `manuals.html` · `lead-times.html` | Support |
| `warranty.html` · `privacy.html` · `terms.html` | Legal |

All mega-menu items and footer links point to these pages. The mega-menu structure
lives in `OF_DATA.megaMenu` (`assets/data.js`) as `{ label, href }` items — change a
link in one place and it updates the desktop mega-menu, the mobile menu and is ready
for Liquid. On Shopify these map to `/pages/about`, `/pages/contact`, etc.

## Shared assets

- `assets/tailwind.config.js` — brand palette (greens, mint, ink), fonts (Syne / Hanken Grotesk), animations. Loaded after the Tailwind CDN.
- `assets/theme.css` — small global layer (scrollbar, `x-cloak`, fonts).
- `assets/data.js` — **all demo content** (`window.OF_DATA`): machines, accessories, wizard steps, blog, events, FAQs, account, mega-menu. *This is the single place to swap in Shopify data later.*
- `assets/theme.js` — injects the shared **header, mega-menu, mobile menu, cart drawer, variant picker and footer**, and registers the global Alpine store `$store.shop` (cart, currency, search, toasts). Cart + currency persist in `localStorage` so they survive page navigation.
- `assets/build.js` — the configurator component (`window.buildWizard()`).

## How the shared chrome works

Each page has empty `<div id="site-header"></div>` and `<div id="site-footer"></div>`.
`theme.js` fills them before Alpine boots, so there's a single source of truth for the
header/footer across all pages.

## Porting to Shopify (per page)

1. **Header/footer** (`theme.js`) → `sections/header.liquid`, `sections/footer.liquid`, included from `layout/theme.liquid`.
2. **Data** (`data.js`) → replace each array with Liquid loops:
   `{% for product in collection.products %}` … keep the same markup, swap `x-text="m.name"` for `{{ product.title }}`, `:src="m.img"` for `{{ product.featured_image | image_url }}`, etc.
3. **Cart store** (`theme.js`) → Shopify AJAX cart (`/cart/add.js`, `/cart.js`); the drawer markup stays.
4. **Configurator** (`build.js`) → a product template with line-item properties; each chosen step becomes a `properties[...]` field on add-to-cart.

Anywhere you see `x-text` / `x-for` / `:src` is exactly where a Liquid object drops in.

## Notes

- Tailwind Play CDN is used for zero-config preview. For production, compile Tailwind and keep the same tokens from `tailwind.config.js`.
- Verified: JS syntax, store + configurator logic, header/footer injection, and all
  Alpine expressions across every page parse cleanly. (A live pixel render wasn't run
  here — just open the pages in a browser to view.)
