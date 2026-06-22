## 1. Project scaffold

- [x] 1.1 Create `backend/` directory with `package.json` (express, pg, dotenv, cors, express-validator)
- [x] 1.2 Create backend entry point (`src/index.js`) with Express app, JSON middleware, CORS, and error handler
- [x] 1.3 Set up database connection module (`src/db.js`) using `pg` Pool with env-based config
- [x] 1.4 Create `migrations/` directory with `001_create_categories.sql` (id UUID PK, name VARCHAR(30), description TEXT, image_url TEXT, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ; unique index on LOWER(name))
- [x] 1.5 Create migration runner script to apply SQL files in order
- [x] 1.6 Create `frontend/` directory with React + Tailwind scaffold (vite or CRA)
- [x] 1.7 Add API client utility in frontend (`src/api.js`) with base URL config

## 2. Backend — categories API

- [x] 2.1 Create auth middleware (`src/middleware/auth.js`) that verifies JWT, extracts user + role, and attaches to `req.user`
- [x] 2.2 Create admin guard middleware that checks `req.user.role === 'admin'` and returns 403 if not
- [x] 2.3 Create `src/routes/categories.js` Express router with auth + admin middleware applied
- [x] 2.4 Implement `GET /api/categories` — returns active categories; accepts `?includeArchived=true` for admins
- [x] 2.5 Implement `GET /api/categories/:id` — returns single category by ID (public)
- [x] 2.6 Implement `POST /api/categories` — validates name (3-30 chars, alphanumeric+spaces only), description, image_url; checks case-insensitive duplicate; inserts and returns created category
- [x] 2.7 Implement `PATCH /api/categories/:id` — validates fields; updates name/description/image_url; name changes reflect via JOIN (no cascade needed per design)
- [x] 2.8 Implement `DELETE /api/categories/:id` — checks product count before deleting; if products > 0 returns 409 with error message; otherwise hard-deletes
- [x] 2.9 Implement `PATCH /api/categories/:id/archive` — sets `is_active = false`; does not remove category
- [x] 2.10 Add `src/routes/index.js` that mounts category routes under `/api/categories`

## 3. Frontend — admin category management page

- [x] 3.1 Create `src/pages/admin/CategoriesPage.jsx` — fetches categories, displays table with columns (name, description, status, actions)
- [x] 3.2 Create `src/components/admin/CategoryForm.jsx` — modal/drawer form with fields (name, description, image_url); client-side validation (3-30 chars, no special chars)
- [x] 3.3 Implement create flow — form submission calls `POST /api/categories`, refreshes list, shows success toast
- [x] 3.4 Implement edit flow — pre-fill form with existing data, `PATCH` on submit, refreshes list
- [x] 3.5 Implement delete flow — confirmation dialog; calls `DELETE /api/categories/:id`; on 409 shows error and offers archive button
- [x] 3.6 Implement archive flow — confirmation dialog; calls `PATCH /api/categories/:id/archive`; shows "Archived" badge in table
- [x] 3.7 Add "Show archived" toggle to filter active/archived categories in the list
- [x] 3.8 Add route for categories page in admin router (e.g., `/admin/categories`)

## 4. Frontend — kiosk category display

- [x] 4.1 Create kiosk menu section component that fetches `GET /api/categories` and renders each active category as a section header
- [x] 4.2 Integrate category sections into the existing kiosk menu page (replacing any hardcoded navigation)

## 5. Testing

- [x] 5.1 Write backend integration tests for each category endpoint (create, read, update, delete, archive, duplicate, validation errors)
- [x] 5.2 Write frontend unit tests for CategoryForm validation logic (name length, special chars)
- [x] 5.3 Write frontend integration test for CategoriesPage (fetch, render, CRUD flows)
- [x] 5.4 Verify responsive layout and touch-friendly targets for admin category page (tablets)
