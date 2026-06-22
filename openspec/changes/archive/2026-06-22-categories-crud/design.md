## Context

The Butler system is in its initial development phase — no application code exists yet. The categories CRUD feature is the first capability to be implemented. This means the design must also establish the foundational project setup (database connection, Express app structure, React app scaffold) alongside the specific category management logic.

The categories will drive the self-service kiosk navigation. Products will reference categories via a foreign key. Categories are flat (no hierarchy) with soft-delete via an `is_active` flag.

## Goals / Non-Goals

**Goals:**
- Database: `categories` table with id, name, description, image_url, is_active, timestamps
- Backend: RESTful API at `/api/categories` with full CRUD + archive + cascade rename + duplicate detection
- Frontend: Admin panel page for category management (list, form, archive/delete controls)
- Frontend: Kiosk integration — display active categories as menu sections
- Validation: name 3-30 chars, no special characters, case-insensitive duplicate check
- Authorization: Admin-only for management; public read for active categories in kiosk

**Non-Goals:**
- Product CRUD (separate change)
- Role management or RBAC system (assumes existing auth middleware)
- Real-time sync via Socket.io for category changes (polling or refresh is acceptable initially)
- Bulk category operations (import/export)

## Decisions

### 1. Database: `categories` table with `is_active` soft-delete
- **Why**: Supports both hard-delete (empty categories) and archive (categories with products). Querying `WHERE is_active = true` ensures the kiosk only shows active categories without data loss.
- **Alternative considered**: Separate `archived_at` timestamp instead of boolean — rejected because the spec uses a binary active/inactive state and a boolean is simpler.
- **Unique constraint**: `UNIQUE (LOWER(name))` via a unique index on `LOWER(name)` to enforce case-insensitive uniqueness at the database level.

### 2. Backend: Express router with middleware stack
- **Why**: Follows Express conventions. The router applies auth + admin middleware at the router level so all routes inherit protection.
- **Routes**:
  - `GET /api/categories` — public, returns active categories (with optional `?includeArchived=true` for admin)
  - `GET /api/categories/:id` — public
  - `POST /api/categories` — admin only
  - `PATCH /api/categories/:id` — admin only
  - `DELETE /api/categories/:id` — admin only (rejected if products exist)
  - `PATCH /api/categories/:id/archive` — admin only
- **Validation**: `express-validator` or custom middleware for name length, character restrictions.

### 3. Cascade rename does NOT cascade at DB level
- **Why**: The `products` table will store `category_id` (foreign key to `categories.id`), not the category name. When the category name changes, the kiosk fetches the category name from the `categories` table via the relation. No actual cascade update is needed — the join handles it automatically.
- **Alternative considered**: Denormalizing category name into the products table and cascading updates — rejected because it introduces data redundancy and update complexity without benefit.

### 4. Frontend: Single admin page with list + modal form
- **Why**: Categories are simple entities (name, description, image URL). A single page with a table list and a modal/drawer form is sufficient. No dedicated route per category needed.
- **Tech**: React component with `fetch` or a lightweight data layer. Tailwind CSS for styling. The admin layout should already exist from a prior setup.
- **Kiosk integration**: The kiosk menu component will fetch `GET /api/categories` and render sections.

### 5. Project scaffold — minimal setup
- **Why**: Since no project code exists, we need `package.json`, Express app entry point, and basic React scaffold. Use a monorepo with `backend/` and `frontend/` directories.
- **Database driver**: `pg` (node-postgres) with `dotenv` for config. Raw SQL for migrations initially (a `migrations/` folder with timestamped SQL files), keeping it simple until Prisma/Drizzle is introduced in a later change.

## Risks / Trade-offs

- **[Risk] No migration framework**: Raw SQL migrations are error-prone in team environments. → **Mitigation**: Document migration steps clearly; adopt Drizzle or Prisma in a follow-up change.
- **[Risk] Category deletion blocking**: An admin might be frustrated if they cannot delete a category with products. → **Mitigation**: The UI clearly offers archive as an alternative and shows the product count.
- **[Risk] Kiosk stale data**: If categories change while a user is browsing the kiosk, they might see outdated names. → **Mitigation**: The kiosk fetches categories on load. Real-time updates via Socket.io can be added later.

## Open Questions

- Should the `categories` table include a `display_order` column for manual sorting, or use alphabetical order?
- What is the exact structure of the existing auth middleware (JWT payload shape, role field name)? This will affect the admin guard implementation.
