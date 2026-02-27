# Funny Shop — E-commerce Demo

A **test/demo project** — a full-stack e-commerce web application (product catalog, cart, orders, auth) built with Next.js and modern frontend tools. Not a production service.

---

## Live Demo

**[Open the app → https://products-shop-funny.vercel.app/](https://products-shop-funny.vercel.app/)**

---

## Overview

- **Purpose:** Demo/test project to practice Next.js (App Router), state management, auth, and third-party integrations.
- **Scope:** Product listing, shopping cart, checkout flow, user authentication, theme switching, i18n, and Telegram bot integration.
- **Data:** Products from [DummyJSON](https://dummyjson.com/); photos from [Unsplash](https://unsplash.com/) (API keys required for Unsplash).

---

## Tech Stack

| Category        | Technologies |
|----------------|--------------|
| **Framework**   | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Language**   | [TypeScript](https://www.typescriptlang.org/) |
| **UI**         | [HeroUI v2](https://heroui.com/), [Tailwind CSS](https://tailwindcss.com/), [Sass](https://sass-lang.com/) |
| **State**      | [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Persist](https://github.com/rt2zz/redux-persist) |
| **Auth**       | [NextAuth.js](https://next-auth.js.org/) (Credentials) |
| **i18n**       | [i18next](https://www.i18next.com/), [react-i18next](https://react.i18next.com/) (EN / UK) |
| **APIs**       | DummyJSON (products), Unsplash (photos) |
| **Integrations** | [Telegraf](https://telegraf.js.org/) (Telegram bot webhook) |
| **Deploy**     | [Vercel](https://vercel.com/) |

Additional: Framer Motion, Font Awesome, react-icons, better-sqlite3 (local data), Vercel Speed Insights.

---

## Features

- **Products:** List, filters (category, price), pagination, product detail page, discount display.
- **Cart:** Add/remove items, quantity, subtotal/discount/shipping, persisted in `localStorage`.
- **Checkout:** Shipping form, order summary, thank-you page.
- **Auth:** Login / Sign up (credentials), protected dashboard route.
- **Theme:** Light / dark mode with persistence.
- **Languages:** English and Ukrainian via header language select.
- **Telegram:** Webhook and chat widget integration (optional; requires bot token and setup).

---

## Project Structure (high level)

```
├── app/
│   ├── (auth)/          # Login, Sign up
│   ├── (content)/       # Main app: products, cart, orders, unsplash, about
│   ├── (marketing)/     # Landing / marketing page
│   ├── dashboard/       # Protected page
│   └── api/             # NextAuth, Telegram webhook routes
├── components/          # Header, cart, filters, language select, etc.
├── context/             # Theme context (+ i18n init)
├── lib/
│   ├── api/             # API client, Dummy/Unsplash requests
│   ├── auth/            # NextAuth config, authorize
│   ├── features/        # Redux slices (cart, filter, pagination, unsplash), i18n
│   ├── store.ts         # Redux store + persist
│   └── types.ts
├── actions/             # Server actions (login, signup, address, etc.)
└── styles/              # Global CSS
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Install and run

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and start (production-like)

```bash
npm run build
npm start
```

### Environment (optional)

- **NextAuth:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (and credentials/DB if you add them).
- **Unsplash:** `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` for the photos section.
- **Telegram:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_CHAT_ID` for the bot (see `TELEGRAM_SETUP.md`).

See `.env.example` or repo docs if present.

---

## Documentation in repo

- `TELEGRAM_SETUP.md` — Telegram bot and webhook setup.
- `VERCEL_DEPLOY.md` — Deployment on Vercel.

---

## License

[MIT](LICENSE).
