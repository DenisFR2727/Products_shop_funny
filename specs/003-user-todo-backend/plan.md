# Implementation Plan: Персональні завдання у серверному сховищі

**Branch**: `[003-user-todo-backend]` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-user-todo-backend/spec.md`

## Summary

Перенести todo persistence з MockAPI до наявного Express/Mongoose backend і створити MongoDB collection `todos` у базі `products_shop`. Усі todo endpoints отримують підтверджений user ID від Next.js server через захищений internal-service context, ніколи не приймають власника з query/body, та виконують list/get/update/delete за складеним фільтром `{ _id, userId }`. Frontend зберігає наявні Server Actions і optimistic UI, але API client передає server-derived actor context та використовує спільний backend URL.

## Technical Context

**Language/Version**: TypeScript 5.6.3 у Next.js застосунку; TypeScript 5.7.3 у backend; ES2022 backend target

**Primary Dependencies**: Next.js 15.3.8, React 19.1.1, NextAuth 4.24.13, Express 5.1.0, Mongoose 8.9.5

**Storage**: MongoDB database `products_shop`; нова Mongoose collection `todos` з compound index `{ userId: 1, createdAt: -1 }`

**Testing**: Jest 30.3 для frontend/actions; backend typecheck і `tsx --test` для model/controller/middleware contract tests; ручна multi-user integration validation

**Target Platform**: Next.js web application і Node.js REST backend; локальна MongoDB або Atlas-compatible deployment

**Project Type**: Web application з Next.js frontend/Server Actions та окремим Express backend

**Performance Goals**: Створення і завантаження списку завершуються до 2 секунд у 95% нормальних операцій; owner-scoped index підтримує newest-first list query

**Constraints**: user ID походить лише з чинної NextAuth session; internal secret доступний тільки server processes; todo title 1–200 символів після trim; старі MockAPI tasks не мігрують; API response зберігає чинний `Todo` shape

**Scale/Scope**: Одна нова collection, п'ять REST operations, один owner-auth middleware, оновлення наявного todo API client і Server Actions; без pagination у цій версії

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Файл constitution є незаповненим шаблоном і не визначає додаткових gates. План перевірено за чинними workspace rules:

- PASS: UI-компоненти не містять persistence або ownership business logic.
- PASS: Server Actions отримують session identity; API client ізольований у `lib/api`.
- PASS: backend розділений на middleware, routes, controllers і model.
- PASS: усі request/response/error structures типізовані без `any`.
- PASS: loading, error, empty та optimistic states уже присутні й зберігаються.
- PASS: ownership перевіряється backend для кожної операції, а не лише в UI.
- PASS: нові зовнішні dependencies не потрібні; використовується наявний stack.

**Post-design re-check**: PASS. Data model, REST contract і quickstart зберігають layer boundaries, typed errors та owner isolation. Complexity exceptions відсутні.

## Project Structure

### Documentation (this feature)

```text
specs/003-user-todo-backend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── todo-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── app.ts
│   ├── config/env.ts
│   ├── controllers/todos.controller.ts
│   ├── middleware/internal-auth.ts
│   ├── middleware/error-handler.ts
│   ├── models/Todo.ts
│   └── routes/todos.routes.ts
└── tests/
    ├── internal-auth.test.ts
    └── todos.test.ts

lib/api/
├── config.ts
└── todo.ts

actions/todo/
├── create-todo.ts
├── get-user-todos.ts
├── get-todo-by-id.ts
├── update-todo.ts
├── delete-todo.ts
├── todo-action-helpers.ts
└── tests/

components/todo/
├── types.ts
├── hooks/
└── __tests__/
```

**Structure Decision**: Розширити наявний backend тим самим model/router/controller pattern, що вже використовується для users і reviews. Next.js залишається trusted BFF: він підтверджує session, а backend приймає actor identity лише від запиту з дійсним internal secret.

## Implementation Strategy

1. Додати обов'язковий `INTERNAL_API_SECRET` до root і backend server environments; todo API client додає `Authorization: Bearer …` та `X-User-Id` тільки після успішного `getServerSession`.
2. Додати todo-only Express middleware, який у constant time перевіряє internal secret, валідовує user ID і записує actor identity у `res.locals`.
3. Створити `Todo` schema: `title`, `userId`, `completed`, automatic timestamps; trim/maxLength/default validation, compound owner/time index і JSON transform до чинного frontend contract.
4. Реалізувати `/todo` list/create та `/todo/:id` get/patch/delete. Ігнорувати owner/time fields із payload; get/update/delete виконувати одним owner-scoped database query.
5. Перемкнути `API_TODOS_CREATE` на `BACKEND_API_URL`; прибрати `userId` із query/body payload contracts і передавати actor context окремо на server-only API boundary.
6. Оновити Server Actions так, щоб кожна todo API operation отримувала session user ID; зберегти поточні validation, optimistic replacement та user-facing error states.
7. Додати backend і action tests для create/list, newest-first order, empty state, validation, unauthorized request, cross-user access, update/delete ownership та service failures.
8. Оновити backend README/env example і виконати quickstart з двома користувачами.

## Documentation Basis

- Встановлено Mongoose 8.9.5; використано офіційну документацію Mongoose 8.19.1 (той самий major) щодо `timestamps`, compound indexes та обов'язкового `runValidators: true` для update validators.
- Встановлено Express 5.1.0; використано офіційну документацію Express 5.1.0 щодо `res.locals`, Promise rejection forwarding і розташування error middleware після routes.
- Встановлено NextAuth 4.24.13; використано офіційну документацію NextAuth v4 щодо JWT session callbacks і server-side verified token/session identity.
- Релевантні breaking changes: Express 5 автоматично передає rejected async-handler promises до error middleware; Mongoose update validators не вмикаються автоматично й мають бути задані явно. Поточний `asyncHandler` може залишитися для консистентності, але не є технічно обов'язковим.

## Complexity Tracking

Порушень constitution або workspace gates немає; додаткове обґрунтування складності не потрібне.
