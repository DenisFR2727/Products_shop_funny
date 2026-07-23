# Tasks: Персональні завдання у серверному сховищі

**Input**: Design documents from `/specs/003-user-todo-backend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/todo-api.yaml, quickstart.md

**Tests**: Included because the implementation plan explicitly requires backend contract, ownership, and frontend action regression coverage.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task in the same batch.
- **[Story]**: Maps the task to a user story from spec.md.
- Every task includes an exact repository-relative file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare backend testing and environment templates without changing runtime behavior.

- [X] T001 Configure the `tsx --test` backend test script and shared HTTP test helpers in `backend/package.json` and `backend/tests/test-helpers.ts`
- [X] T002 [P] Document matching server-only `INTERNAL_API_SECRET` placeholders in `.env.example` and `backend/.env.example`

**Checkpoint**: Backend tests can be invoked and required configuration is discoverable without committing a secret.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish trusted actor propagation and shared error handling required by every todo operation.

**⚠️ CRITICAL**: No user story implementation starts until this phase is complete.

### Foundation tests

- [X] T003 [P] Add failing tests for missing, invalid, and valid internal bearer authorization plus `X-User-Id` propagation in `backend/tests/internal-auth.test.ts`
- [X] T004 [P] Add failing tests for authorization, validation, not-found, and service-failure mappings in `actions/todo/tests/todo-errors.test.ts`

### Foundation implementation

- [X] T005 Add required `internalApiSecret` loading with no fallback and safe startup failure in `backend/src/config/env.ts`
- [X] T006 Implement constant-time bearer verification and request-scoped actor identity in `backend/src/middleware/internal-auth.ts`
- [X] T007 [P] Point todo requests at the shared backend and add a server-only internal secret accessor in `lib/api/config.ts`
- [X] T008 Add a reusable actor-authenticated request-options builder that emits bearer and `X-User-Id` headers in `lib/api/todo.ts`
- [X] T009 Implement distinct safe mappings for 400, 401, 404, and service failures in `actions/todo/todo-errors.ts`

**Checkpoint**: The backend can authenticate the trusted Next.js caller, every todo request can carry verified actor context, and errors have stable user-facing categories.

---

## Phase 3: User Story 1 - Додавання персонального завдання (Priority: P1) 🎯 MVP

**Goal**: An authenticated user creates a persisted task owned by that user, receives the canonical stored task, and sees no duplicate optimistic row.

**Independent Test**: Sign in, add a valid task, reload, and confirm one incomplete task remains associated with the same account; unauthenticated and invalid submissions create nothing.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [X] T010 [P] [US1] Add create-contract tests for trim, 200-character limit, server-owned identity/time/status, canonical JSON, and invalid payloads in `backend/tests/todos-create.test.ts`
- [X] T011 [P] [US1] Add Server Action tests for session-required creation and title-only API payloads in `actions/todo/tests/create-todo.test.ts`
- [X] T012 [P] [US1] Add optimistic-row tests for canonical replacement and rollback after validation or service failure in `components/todo/__tests__/useTodoForm.test.tsx`

### Implementation for User Story 1

- [X] T013 [US1] Create the timestamped Todo schema, validation, `{ userId: 1, createdAt: -1 }` index, immutable owner, and compatibility JSON transform in `backend/src/models/Todo.ts`
- [X] T014 [US1] Implement allowlisted create validation and actor-owned Todo creation in `backend/src/controllers/todos.controller.ts`
- [X] T015 [US1] Add the protected `POST /todo` route and mount the todo router in `backend/src/routes/todos.routes.ts` and `backend/src/app.ts`
- [X] T016 [US1] Change `createTodoPost` to accept actor identity separately and send only the title payload in `lib/api/todo.ts`
- [X] T017 [US1] Pass the verified session user ID to the todo API boundary and remove client-owned creation time/owner payload fields in `actions/todo/create-todo.ts`
- [X] T018 [US1] Roll back failed optimistic creates while preserving canonical replacement on success in `components/todo/hooks/useTodoForm.ts`, `components/todo/hooks/useOptimisticTodoList.ts`, and `components/todo/types.ts`

**Checkpoint**: User Story 1 works independently as the MVP; a valid authenticated create persists once and survives reload.

---

## Phase 4: User Story 2 - Завантаження власного списку завдань (Priority: P1)

**Goal**: An authenticated user loads only their persisted tasks newest-first and receives a valid empty state when none exist.

**Independent Test**: Seed tasks for two actor IDs, load each list, and verify complete owner isolation, newest-first order, persistence after reload, and `[]` for an owner without tasks.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [X] T019 [P] [US2] Add list-contract tests for owner filtering, newest-first sorting, and empty arrays in `backend/tests/todos-list.test.ts`
- [X] T020 [P] [US2] Add Server Action tests for authenticated list loading, empty state, missing session, and backend failure in `actions/todo/tests/get-user-todos.test.ts`

### Implementation for User Story 2

- [X] T021 [US2] Implement actor-scoped newest-first Todo listing in `backend/src/controllers/todos.controller.ts`
- [X] T022 [US2] Add the protected `GET /todo` route in `backend/src/routes/todos.routes.ts`
- [X] T023 [US2] Remove the owner query parameter, attach actor headers, and preserve `Todo[]` normalization in `lib/api/todo.ts`
- [X] T024 [US2] Use the verified session identity for backend list retrieval and retain loading/error/empty outcomes in `actions/todo/get-user-todos.ts`

**Checkpoint**: User Stories 1 and 2 provide persistent create and reloadable personal lists without exposing another user's tasks.

---

## Phase 5: User Story 3 - Захист завдань від інших користувачів (Priority: P1)

**Goal**: Every individual-task operation enforces ownership in the backend and returns the same not-found outcome for absent and foreign tasks.

**Independent Test**: Create a task as actor A, then attempt get, patch, and delete as actor B; all return 404, reveal no task data, and leave A's task unchanged.

### Tests for User Story 3

> Write these tests first and confirm they fail before implementation.

- [X] T025 [P] [US3] Add backend ownership tests covering absent/foreign get, patch, delete, payload owner override, malformed IDs, and uniform 404 responses in `backend/tests/todos-ownership.test.ts`

### Implementation for User Story 3

- [X] T026 [US3] Add ObjectId validation, patch field allowlisting, and atomic `{ _id, userId }` get/update/delete handlers with `runValidators: true` in `backend/src/controllers/todos.controller.ts`
- [X] T027 [US3] Add protected `GET`, `PATCH`, and `DELETE /todo/:id` routes in `backend/src/routes/todos.routes.ts`
- [X] T028 [US3] Ensure the todo router applies internal actor middleware before every todo handler in `backend/src/routes/todos.routes.ts`

**Checkpoint**: All backend task reads and mutations are owner-safe even when called outside the UI.

---

## Phase 6: User Story 4 - Продовження роботи з власними завданнями (Priority: P2)

**Goal**: Existing edit, complete/reopen, and delete controls persist owner-approved changes through the new backend.

**Independent Test**: As the owner, rename and complete a task, reload to verify both changes, then delete it and verify it does not return; repeat non-owner attempts to confirm rejection.

### Tests for User Story 4

> Write these tests first and confirm they fail before implementation.

- [X] T029 [P] [US4] Add authenticated get-by-ID and foreign-task regression tests in `actions/todo/tests/get-todo-by-id.test.ts`
- [X] T030 [P] [US4] Extend title/completion mutation tests to assert actor propagation and canonical backend results in `actions/todo/tests/update-todo.test.ts`
- [X] T031 [P] [US4] Extend delete tests to assert actor propagation, owner-only deletion, and missing-task mapping in `actions/todo/tests/delete-todo.test.ts`

### Implementation for User Story 4

- [X] T032 [US4] Update get, patch, and delete API functions to require actor identity and remove mutable `userId` payload support in `lib/api/todo.ts`
- [X] T033 [US4] Pass session actor identity through owner-aware load and mutation helpers without relying on client-side ownership as authorization in `actions/todo/todo-action-helpers.ts`
- [X] T034 [P] [US4] Pass verified actor identity to the backend get operation in `actions/todo/get-todo-by-id.ts`
- [X] T035 [P] [US4] Pass verified actor identity to title and completion updates in `actions/todo/update-todo.ts`
- [X] T036 [P] [US4] Pass verified actor identity to deletion and preserve the deleted-ID response state in `actions/todo/delete-todo.ts`

**Checkpoint**: All four user stories work end-to-end and existing task controls persist safely against MongoDB.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Synchronize documentation, validate security boundaries, and prove the complete feature.

- [X] T037 [P] Document the todo collection, endpoints, required secret, owner isolation, and local run commands in `backend/README.md`
- [X] T038 [P] Reconcile implemented request/response/status behavior with `specs/003-user-todo-backend/contracts/todo-api.yaml`
- [X] T039 Audit secret handling, actor headers, payload allowlists, and owner-scoped filters in `lib/api/todo.ts`, `backend/src/middleware/internal-auth.ts`, and `backend/src/controllers/todos.controller.ts`
- [X] T040 Run root Jest/build plus backend tests/typecheck and record any validation corrections in `specs/003-user-todo-backend/quickstart.md`
- [X] T041 Execute the two-user browser/API/MongoDB scenarios and index verification from `specs/003-user-todo-backend/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: No dependencies.
- **Phase 2 — Foundational**: Depends on Phase 1 and blocks every user story.
- **Phase 3 — US1**: Depends on Foundation; delivers the create MVP and Todo model.
- **Phase 4 — US2**: Depends on Foundation and the Todo model from US1.
- **Phase 5 — US3**: Depends on Foundation and the Todo model from US1; may run in parallel with US2 after US1.
- **Phase 6 — US4**: Depends on US3 backend mutation endpoints and integrates existing frontend controls.
- **Phase 7 — Polish**: Depends on all selected user stories.

### User Story Dependency Graph

```text
Setup
  -> Foundation
      -> US1 (create + model)
          -> US2 (personal list) ─┐
          -> US3 (ownership) ─────┼-> US4 (edit/complete/delete integration)
                                 └-> Polish
```

### User Story Dependencies

- **US1 (P1)**: First executable story after Foundation; no dependency on another story.
- **US2 (P1)**: Reuses the Todo model from US1 but is independently testable through list retrieval.
- **US3 (P1)**: Reuses the Todo model from US1 and can proceed in parallel with US2.
- **US4 (P2)**: Requires owner-safe mutation endpoints from US3 before frontend mutation integration.

### Within Each User Story

- Write story tests first and verify they fail for the expected missing behavior.
- Implement schema/query behavior before route integration.
- Implement backend contract before changing the consuming Server Action.
- Run the independent story test at each checkpoint.

## Parallel Opportunities

- T002 can run in parallel with T001.
- T003 and T004 can run in parallel; T007 can proceed independently while backend auth tests are written.
- T010, T011, and T012 can run in parallel before US1 implementation.
- T019 and T020 can run in parallel.
- US2 and US3 can run in parallel after US1 completes.
- T029, T030, and T031 can run in parallel before US4 integration.
- T034, T035, and T036 can run in parallel after T032 and T033.
- T037 and T038 can run in parallel.

## Parallel Examples

### User Story 1

```text
Task: "T010 Add backend create-contract tests in backend/tests/todos-create.test.ts"
Task: "T011 Add create Server Action tests in actions/todo/tests/create-todo.test.ts"
Task: "T012 Add optimistic create tests in components/todo/__tests__/useTodoForm.test.tsx"
```

### User Story 2

```text
Task: "T019 Add list-contract tests in backend/tests/todos-list.test.ts"
Task: "T020 Add list Server Action tests in actions/todo/tests/get-user-todos.test.ts"
```

### User Story 3

```text
Task: "T025 Add ownership contract tests in backend/tests/todos-ownership.test.ts"
Task after US1: "Implement US3 while another developer implements US2"
```

### User Story 4

```text
Task: "T029 Add get-by-ID action tests in actions/todo/tests/get-todo-by-id.test.ts"
Task: "T030 Extend update action tests in actions/todo/tests/update-todo.test.ts"
Task: "T031 Extend delete action tests in actions/todo/tests/delete-todo.test.ts"
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 to persist authenticated task creation.
3. Validate US1 independently, including reload persistence and optimistic replacement.
4. Continue immediately to US2 for the user-requested backend list retrieval before considering the MVP production-ready.

### Incremental Delivery

1. **US1**: Authenticated create persists to MongoDB.
2. **US2**: Users reload complete personal lists.
3. **US3**: Backend becomes independently owner-safe.
4. **US4**: Existing edit, completion, and delete controls use the new backend.
5. **Polish**: Contracts, docs, automated checks, and two-user validation complete.

### Suggested Delivery Scope

- **Minimum technical MVP**: Setup + Foundation + US1.
- **Minimum scope matching the user's request**: Setup + Foundation + US1 + US2 + US3.
- **Full non-regression delivery**: All phases through US4 and Polish.

## Notes

- `[P]` indicates file-level parallelism, not permission to bypass listed dependencies.
- Do not commit real values for `INTERNAL_API_SECRET`.
- Do not accept `userId`, timestamps, IDs, or completion state in create payloads.
- Return the same 404 contract for absent and foreign task IDs.
- Existing MockAPI todo documents are intentionally not migrated.
- Commit only when explicitly requested by the user.
