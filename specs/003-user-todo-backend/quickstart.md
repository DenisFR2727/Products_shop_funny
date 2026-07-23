# Quickstart Validation: User Todo Backend

## Prerequisites

- Root and `backend/` dependencies installed.
- MongoDB reachable through `backend/.env` `MONGODB_URI`.
- Two existing application users for browser-level isolation tests.
- A strong random `INTERNAL_API_SECRET` configured with the same value in:
  - root `.env.local` for Next.js server requests;
  - `backend/.env` for Express verification.

Example non-secret configuration:

```env
# root .env.local
USERS_API_URL=http://localhost:4000
INTERNAL_API_SECRET=<same-strong-random-value>
```

```env
# backend/.env
MONGODB_URI=mongodb://127.0.0.1:27017/products_shop
PORT=4000
CORS_ORIGIN=http://localhost:3000
INTERNAL_API_SECRET=<same-strong-random-value>
```

Never commit either env file or print the secret in logs.

## 1. Static and automated validation

From the repository root:

```powershell
npm test -- --runInBand
npm run build
npm --prefix backend run typecheck
npm --prefix backend test
```

Expected:

- Existing todo UI/action tests still pass.
- New owner-context and API wiring tests pass.
- Backend middleware/controller/model contract tests pass.
- Both TypeScript projects compile.

## 2. Start the application

Ensure MongoDB is running, then:

```powershell
npm run dev:all
```

In another terminal:

```powershell
Invoke-RestMethod "http://localhost:4000/health"
```

Expected: backend health returns `{ status: "ok" }`, Next.js is available on `http://localhost:3000`, and backend logs show connection to `products_shop`.

## 3. Validate the internal API contract

Set local shell values without writing them to history where possible:

```powershell
$secret = Read-Host "INTERNAL_API_SECRET"
$headersA = @{
  Authorization = "Bearer $secret"
  "X-User-Id" = "quickstart-user-a"
}
$headersB = @{
  Authorization = "Bearer $secret"
  "X-User-Id" = "quickstart-user-b"
}
```

Create one task for each actor:

```powershell
$todoA = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/todo" `
  -Headers $headersA `
  -ContentType "application/json" `
  -Body '{"title":"Task owned by A"}'

$todoB = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/todo" `
  -Headers $headersB `
  -ContentType "application/json" `
  -Body '{"title":"Task owned by B"}'
```

Load both lists:

```powershell
$listA = Invoke-RestMethod "http://localhost:4000/todo" -Headers $headersA
$listB = Invoke-RestMethod "http://localhost:4000/todo" -Headers $headersB
```

Expected:

- `$listA` contains `todoA` and never `todoB`.
- `$listB` contains `todoB` and never `todoA`.
- Each response follows [contracts/todo-api.yaml](./contracts/todo-api.yaml).

## 4. Validate cross-user protection

Attempt to retrieve and update A's task using B's context:

```powershell
Invoke-RestMethod "http://localhost:4000/todo/$($todoA.id)" -Headers $headersB

Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:4000/todo/$($todoA.id)" `
  -Headers $headersB `
  -ContentType "application/json" `
  -Body '{"completed":true}'
```

Expected: both requests return `404`; A's task is unchanged. A request without bearer authorization returns `401`.

## 5. Validate browser flows

1. Sign in as user A and open the todo page.
2. Add two tasks, edit one title, and complete the other.
3. Reload the page.
4. Sign out, sign in as user B, and open the todo page.
5. Add and delete a task as user B.
6. Sign back in as user A.

Expected:

- User A's changes persist after reload and later sign-in.
- User B never sees A's tasks.
- User A never sees B's tasks.
- Create optimistic rows are replaced by one canonical stored row without duplicates.
- Empty, loading and failure states remain functional.

## 6. Verify MongoDB persistence

Using `mongosh` against the configured database:

```javascript
use products_shop
db.todos.find({}, { title: 1, userId: 1, completed: 1, createdAt: 1 })
db.todos.getIndexes()
```

Expected:

- Documents exist in the `todos` collection.
- Documents contain server-owned timestamps and owner IDs.
- The owner/newest-first compound index exists.
- No client-supplied owner or creation time overrides stored values.

## 7. Validate failure behavior

Test these cases:

- missing `INTERNAL_API_SECRET`;
- empty, whitespace-only, and 201-character title;
- malformed or missing todo ID;
- update with unsupported fields;
- stopped MongoDB/backend during list and create.

Expected:

- Unauthorized calls return `401`.
- Invalid inputs return `400`.
- Missing/foreign tasks return indistinguishable `404` responses.
- Unexpected service failures produce safe user-facing messages and no optimistic duplicates.

## References

- Data and transition rules: [data-model.md](./data-model.md)
- REST contract: [contracts/todo-api.yaml](./contracts/todo-api.yaml)
- Architecture decisions: [research.md](./research.md)

## Latest validation

Validated on 2026-07-24:

- Root Jest suite: 19 suites and 104 tests passed.
- Backend Node test suite: 11 tests passed.
- Next.js production build passed.
- Backend TypeScript build and typecheck passed.
- Live configured MongoDB create/list/cross-user-404/delete flow passed on an
  isolated backend port; validation records were deleted afterward.
- The `todos` collection contains the `{ userId: 1, createdAt: -1 }` index.
