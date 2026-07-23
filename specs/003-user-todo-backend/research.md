# Research: Персональні завдання у серверному сховищі

## Розміщення todo persistence

**Decision**: Додати Mongoose model, controller і router до наявного `backend/`, використовуючи MongoDB database, визначену `MONGODB_URI`.

**Rationale**: Backend уже підключений до `products_shop`, володіє users/reviews і має готові patterns для schema, JSON transform, async routes та centralized errors. Це виконує вимогу нової `todos` collection без дублювання database connection.

**Alternatives considered**:

- Next.js Route Handlers з прямим MongoDB connection — відхилено, бо створює другий persistence boundary.
- Продовжити MockAPI — відхилено, бо не виконує вимогу MongoDB backend.
- Окремий todo microservice — відхилено як непропорційна складність.

## Передача підтвердженої user identity

**Decision**: Next.js Server Action отримує user ID з `getServerSession`, а server-only todo API client передає його backend разом із обов'язковим internal bearer secret. Backend довіряє `X-User-Id` лише після перевірки secret і зберігає actor ID у `res.locals`.

**Rationale**: NextAuth JWT session належить Next.js process; frontend уже централізовано отримує session server-side. Backend не повинен довіряти `userId` із browser-controlled query/body. Trusted-BFF contract з shared secret додає backend enforcement без дублювання NextAuth runtime у Express.

**Alternatives considered**:

- Залишити `userId` у query/body — відхилено через можливість доступу до чужих tasks.
- Валідувати лише в Server Actions — відхилено, бо прямий backend request обходить перевірку.
- Передавати та розшифровувати NextAuth cookie в Express — відхилено через coupling backend до NextAuth cookie/JWT internals.
- Додати окремі end-user JWT access tokens — відкладено як зміна всієї auth architecture.

## Internal-service authentication

**Decision**: Використати `INTERNAL_API_SECRET` у root server environment і `backend/.env`, порівнювати bearer value constant-time та захистити ним лише todo router.

**Rationale**: Secret ніколи не потрапляє в client bundle, а todo requests виконуються Server Actions. Scoping middleware до todo routes не змінює чинні users/reviews contracts. Production transport має використовувати HTTPS.

**Alternatives considered**:

- Дозволити fallback secret — відхилено як небезпечний production default.
- Захистити всі backend routes одразу — відхилено як scope expansion і потенційний breaking change.
- HMAC кожного payload із nonce — відкладено; для одного trusted caller, TLS і strong shared secret це зайва складність.

## MongoDB schema та індекси

**Decision**: Зберігати `title`, `userId`, `completed` і Mongoose timestamps; додати compound index `{ userId: 1, createdAt: -1 }`.

**Rationale**: Усі list queries фільтрують за owner і сортують newest-first. Compound index відповідає цьому query shape. `timestamps: true` робить creation time server-owned і стабільним.

**Alternatives considered**:

- Зберігати client-provided `createAt` — відхилено, бо клієнт може підробити порядок.
- Посилання `ObjectId` на User — не обрано зараз, бо session може містити Mongo `id` або application `userId`; string owner ID відповідає чинному auth contract.
- Унікальний index на title — відхилено, бо однакові назви допустимі.

## API shape та backward compatibility

**Decision**: Зберегти чинні paths `/todo` і `/todo/:id` та frontend response shape `{ id, title, userId, createAt, completed }`; request ownership і creation time прибрати з client payload.

**Rationale**: Наявні API functions, actions, hooks і optimistic UI вже очікують цей response shape. Model transform може віддати ISO `createAt` з Mongo `createdAt`, не змінюючи UI types.

**Alternatives considered**:

- Перейменувати endpoint на `/todos` — відхилено, бо не дає функціональної користі й збільшує frontend diff.
- Перейменувати frontend field на `createdAt` у межах цієї роботи — відкладено як окреме contract cleanup.
- Повертати raw Mongoose documents — відхилено, бо витікають `_id`, `__v` і storage details.

## Ownership-safe database operations

**Decision**: List використовує `{ userId }`; get, patch і delete використовують один atomic filter `{ _id, userId }`. Відсутній або чужий task повертає однаковий `404`.

**Rationale**: Попереднє завантаження за ID і наступна перевірка owner створює race window та зайвий round trip. Owner-scoped query не розкриває існування чужого task.

**Alternatives considered**:

- `findById()` з перевіркою після fetch — відхилено через disclosure/race risk.
- `403` для чужого task — відхилено, бо підтверджує його існування.
- Видалення/оновлення лише за ID після frontend check — відхилено, бо backend має бути самодостатньо безпечним.

## Input validation

**Decision**: Controller приймає лише `title` для create і allowlist `title`/`completed` для patch; Mongoose schema дублює trim, required і maxLength 200, а update використовує `runValidators: true`.

**Rationale**: Boundary validation дає зрозумілі `400` responses, schema validation захищає persistence від інших code paths. Owner, timestamps і ID не можна змінити payload-ом.

**Alternatives considered**:

- Покладатися лише на frontend validation — відхилено як обхідне.
- Передавати весь body до Mongoose update — відхилено через mass-assignment risk.
- Додати validation library — відхилено, бо для двох полів достатньо typed local validation без нової dependency.

## Error mapping

**Decision**: Backend повертає `400` validation, `401` missing/invalid internal authorization, `404` absent-or-foreign task і `500` unexpected storage failure. Next API boundary перетворює їх на чинний `ApiError`, а actions — на user-safe todo errors.

**Rationale**: Це зберігає existing frontend loading/error behavior і не розкриває internal details. Express error middleware уже централізує unexpected failures.

**Alternatives considered**:

- Завжди `200` з error body — відхилено, бо руйнує HTTP semantics і `apiRequest`.
- Передавати Mongo errors користувачу — відхилено через information leakage.

## Testing strategy

**Decision**: Покрити middleware, schema/controller contracts і action/API wiring; окремо виконати multi-user integration сценарій на реальній local MongoDB.

**Rationale**: Unit tests швидко перевіряють validation та ownership filters, але реальний тест потрібний для collection, index, persistence після reload і повного server-to-server identity path.

**Alternatives considered**:

- Лише frontend mocks — відхилено, бо вони не доводять Mongo persistence або backend isolation.
- Додавати embedded Mongo dependency — відкладено, щоб не збільшувати dependency surface; local/CI Mongo може виконувати integration profile.
