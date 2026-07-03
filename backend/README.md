# products_shop — Auth Backend

MongoDB + Mongoose (Express 5, TypeScript) backend that owns user **registration**, **login lookup**, and **profile/login update**. It replaces the MockAPI `/users` resource with the same REST contract, so the Next.js app only needs a base-URL change.

## Stack

| Package  | Version |
| -------- | ------- |
| express  | 5.2.1   |
| mongoose | 8.24.1  |
| cors     | 2.8.6   |
| dotenv   | 16.6.1  |

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGODB_URI if needed
npm run dev            # tsx watch, http://localhost:4000
```

Requires a running MongoDB (local `mongodb://127.0.0.1:27017` or an Atlas URI).

## Environment

| Var           | Default                                   | Description                       |
| ------------- | ----------------------------------------- | --------------------------------- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/products_shop` | Mongo connection string           |
| `PORT`        | `4000`                                    | HTTP port                         |
| `CORS_ORIGIN` | `http://localhost:3000`                   | Allowed origins (comma-separated) |

## API

Mounted under `/users` (matches `API_ENDPOINTS.USERS`).

| Method | Path            | Body / Query                                     | Response                                 |
| ------ | --------------- | ------------------------------------------------ | ---------------------------------------- |
| `POST` | `/users`        | `{ username, email, phone?, password }`          | `201` created user (`id`, `userId`, ...) |
| `GET`  | `/users?email=` | `email` query                                    | array of matching users (0 or 1)         |
| `PUT`  | `/users/:id`    | any of `username, email, phone, password, image` | updated user                             |
| `GET`  | `/health`       | —                                                | `{ status: "ok" }`                       |

### Reviews (`/reviews`)

| Method | Path       | Body                        | Response                        |
| ------ | ---------- | --------------------------- | ------------------------------- |
| `GET`  | `/reviews` | —                           | array of reviews (newest first) |
| `POST` | `/reviews` | `{ nameUser, text, date? }` | `201` created review            |

### Users notes

- Passwords are hashed with `scrypt` in the `hash:salt` format — identical to the previous
  client-side hashing, so NextAuth's `verifyPassword` keeps working unchanged.
- `GET /users` intentionally returns the `password` field so the existing credentials-based
  login flow (`authorizeUser` / NextAuth) can verify locally.
- `id` is the Mongo `_id` (stringified); `userId` is a server-generated UUID.
- Duplicate email returns `409`.

## Frontend wiring

The Next.js app points at this backend via `USERS_API_URL` (see `lib/api/config.ts`):

```env
# .env.local (Next.js root)
USERS_API_URL=http://localhost:4000
# REVIEWS_API_URL=http://localhost:4000  # optional; defaults to USERS_API_URL
```

Run both together from the project root:

```bash
pnpm dev:all
```
