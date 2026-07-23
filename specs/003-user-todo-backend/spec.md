# Feature Specification: Персональні завдання у серверному сховищі

**Feature Branch**: `[003-user-todo-backend]`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "Implement adding todo tasks on the backend, persist them in the products_shop database, retrieve the list from the backend, and associate displayed tasks with the user who added them."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Додавання персонального завдання (Priority: P1)

Авторизований користувач додає завдання до свого списку, після чого завдання зберігається та відображається як належне саме цьому користувачу.

**Why this priority**: Створення та надійне збереження завдання є основною цінністю функції.

**Independent Test**: Авторизуватися, додати завдання з коректною назвою, оновити сторінку та перевірити, що завдання все ще присутнє у списку цього користувача.

**Acceptance Scenarios**:

1. **Given** користувач авторизований, **When** він додає завдання з коректною непорожньою назвою, **Then** система зберігає завдання з власником, часом створення та початковим статусом "не виконано".
2. **Given** завдання успішно збережено, **When** операція завершується, **Then** користувач бачить створене завдання у своєму списку без дублювання.
3. **Given** користувач не авторизований, **When** він намагається додати завдання, **Then** система відхиляє операцію та не створює запис.

---

### User Story 2 - Завантаження власного списку завдань (Priority: P1)

Авторизований користувач відкриває список завдань і бачить усі збережені завдання, що належать йому, але не бачить завдань інших користувачів.

**Why this priority**: Завдання корисні лише тоді, коли користувач може повернутися до них і отримати правильний персональний список.

**Independent Test**: Створити різні завдання у двох облікових записах, по черзі відкрити список у кожному та перевірити повну ізоляцію даних.

**Acceptance Scenarios**:

1. **Given** авторизований користувач має збережені завдання, **When** він відкриває список, **Then** система показує лише його завдання, упорядковані від найновіших до найстаріших.
2. **Given** авторизований користувач не має завдань, **When** він відкриває список, **Then** система показує зрозумілий порожній стан без помилки.
3. **Given** список завдань був завантажений, **When** користувач оновлює сторінку або входить повторно, **Then** збережені завдання завантажуються знову.
4. **Given** користувач не авторизований, **When** запитується список завдань, **Then** система не повертає жодних користувацьких завдань.

---

### User Story 3 - Захист завдань від інших користувачів (Priority: P1)

Кожен користувач може отримувати та змінювати лише власні завдання незалежно від даних, надісланих із клієнта.

**Why this priority**: Прив'язка лише на рівні відображення не захищає персональні дані; право доступу має перевірятися для кожної операції.

**Independent Test**: Створити завдання користувачем A, а потім від імені користувача B спробувати отримати або змінити його за відомим ідентифікатором; усі такі спроби мають бути відхилені без розкриття даних.

**Acceptance Scenarios**:

1. **Given** завдання належить користувачу A, **When** користувач B намагається отримати його напряму, **Then** система не повертає завдання або відомості про його вміст.
2. **Given** завдання належить користувачу A, **When** користувач B намагається змінити статус, назву або видалити його, **Then** система відхиляє операцію і залишає завдання без змін.
3. **Given** клієнт надсилає ідентифікатор власника, відмінний від авторизованого користувача, **When** створюється завдання, **Then** система ігнорує непідтвердженого власника та не створює завдання для іншої особи.

---

### User Story 4 - Продовження роботи з власними завданнями (Priority: P2)

Після перенесення зберігання на сервер користувач і надалі може позначати власне завдання виконаним, змінювати його назву та видаляти його.

**Why this priority**: Нове місце зберігання не повинно ламати вже доступні операції зі списком.

**Independent Test**: Створити завдання, змінити назву, позначити виконаним, оновити сторінку, а потім видалити його та перевірити збереження кожного результату.

**Acceptance Scenarios**:

1. **Given** завдання належить авторизованому користувачу, **When** він змінює назву або статус, **Then** система зберігає зміну і повертає оновлене завдання.
2. **Given** завдання належить авторизованому користувачу, **When** він видаляє його, **Then** завдання більше не з'являється у наступних завантаженнях списку.

---

### Edge Cases

- Два користувачі одночасно створюють завдання з однаковою назвою.
- Один користувач двічі швидко надсилає одну форму створення.
- Назва складається лише з пробілів або перевищує 200 символів.
- Завдання видалено в іншій вкладці перед спробою оновлення.
- Авторизація користувача завершується під час створення або завантаження списку.
- Сховище тимчасово недоступне або повертає неповну відповідь.
- У сховищі є запис без чинного власника; такий запис не повинен відображатися користувачам.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST persist each successfully created task in the application's central server-side data store.
- **FR-002**: System MUST assign every task a unique identifier, normalized title, owner, creation time, and completion status.
- **FR-003**: System MUST derive the task owner from the authenticated user and MUST NOT trust a client-provided owner identity.
- **FR-004**: System MUST reject task creation when no authenticated user can be established.
- **FR-005**: System MUST reject empty or whitespace-only task titles and titles longer than 200 characters.
- **FR-006**: System MUST initialize every newly created task as not completed.
- **FR-007**: System MUST return only tasks owned by the authenticated user when loading a task list.
- **FR-008**: System MUST return an empty collection, not an error, when the authenticated user has no tasks.
- **FR-009**: System MUST order loaded tasks from newest to oldest using their creation time.
- **FR-010**: System MUST verify ownership before returning, updating, completing, or deleting an individual task.
- **FR-011**: System MUST respond to unauthorized cross-user access without revealing the task title, status, owner, or existence beyond what is necessary.
- **FR-012**: System MUST persist owner-approved title, completion, and deletion changes so they remain effective after reload.
- **FR-013**: System MUST return a complete canonical task after each successful create or update operation so the displayed list matches stored data.
- **FR-014**: System MUST provide distinct user-facing outcomes for validation failure, missing authorization, missing task, and temporary service failure.
- **FR-015**: System MUST avoid showing duplicate list entries when a temporary client-side task is replaced by the stored task.
- **FR-016**: System MUST maintain task-to-user association after a user signs out and later signs in again.

### Key Entities

- **Task**: A personal work item with a unique identifier, title, completion status, creation time, and exactly one owner.
- **User**: An authenticated account that owns zero or more tasks.
- **Task List**: The ordered collection of tasks visible to one authenticated user; it contains no tasks owned by other users.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid task-creation attempts by authenticated test users remain visible after a page reload.
- **SC-002**: Across all multi-user access tests, 0 tasks belonging to another user are displayed, returned, modified, or deleted.
- **SC-003**: 95% of successful task additions appear in the user's list within 2 seconds under normal operating conditions.
- **SC-004**: 95% of task-list loads display either the complete personal list or the empty state within 2 seconds under normal operating conditions.
- **SC-005**: 100% of successful title, completion, and deletion changes remain correct after a page reload.
- **SC-006**: 100% of unauthenticated task creation and retrieval attempts are rejected without creating or disclosing task data.
- **SC-007**: In usability validation, at least 90% of users can add a task and find it again after returning to the page without assistance.

## Assumptions

- The existing authentication system supplies a stable unique user identifier for ownership checks.
- Existing task-title validation rules and current list interactions remain the product standard.
- Task titles are limited to 200 characters to keep list items readable and bound stored input.
- Existing tasks stored in the previous external task service are not migrated automatically; the new persistent task store starts with newly created tasks unless migration is requested separately.
- A task belongs to exactly one user and is not shared with other accounts.
- The default list order is newest first; custom sorting and filtering are outside this feature.
- Task collaboration, reminders, due dates, priorities, categories, and pagination are outside this feature.
- The application already has a supported central server-side database and user records to which task ownership can be linked.
