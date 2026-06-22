## Context

The `categories` table, API, and admin UI exist from the previous change. Products will reference categories via a foreign key. This change adds the `products` table and the admin-facing product registration flow, with strict category existence validation at both the application and database levels.

The system uses Express with ES modules, `pg` for PostgreSQL, `express-validator` for input validation, JWT auth with an admin guard, and raw SQL migrations.

## Goals / Non-Goals

**Goals:**
- Database: `products` table with id, name, description, price, image_url, stock, category_id (FK → categories.id), is_active, timestamps
- Backend: `POST /api/products` endpoint with category existence validation, admin-only access
- Frontend: Admin product registration form with category dropdown (populated from `GET /api/categories`)
- Validation: category_id must reference an existing active category; required fields (name, price, stock); preserve form data on validation errors
- Error handling: 400 with "La categoría seleccionada no existe" for invalid category; 404 if category not found

**Non-Goals:**
- Product list, edit, delete, or search (separate change)
- Product image upload (URL-based reference only)
- Bulk product import
- Kiosk product display (separate change)
- Stock decrement on order (future inventory change)

## Decisions

### 1. Database: `products` table with FK constraint
- **Why**: The FK constraint enforces referential integrity at the database level as a safety net. Application-level validation provides a better user experience (specific error message), while the FK prevents orphaned records even if application validation is bypassed.
- **Schema**: `id UUID PK DEFAULT gen_random_uuid()`, `name VARCHAR(100) NOT NULL`, `description TEXT DEFAULT ''`, `price NUMERIC(10,2) NOT NULL`, `image_url TEXT DEFAULT ''`, `stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)`, `category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT`, `is_active BOOLEAN DEFAULT TRUE`, timestamps.
- **ON DELETE RESTRICT**: Prevents deleting a category that still has products, consistent with the existing category-deletion guard. This mirrors the application-level check in `DELETE /api/categories/:id`.

### 2. Backend: Single POST route under `/api/products`
- **Why**: Follows the same pattern as `categories.js`. Admin-only via existing `authenticate` + `requireAdmin` middleware. Validation with `express-validator`.
- **Category validation**: Application-level check queries `SELECT id FROM categories WHERE id = $1 AND is_active = true` and returns 400 with the specific error message before attempting the INSERT. The FK constraint provides a secondary safety net.
- **Error response shape**: `{ error: "La categoría seleccionada no existe" }` with HTTP 400, matching the existing API error format.

### 3. Frontend: Admin form page with category dropdown
- **Why**: Follows the existing `CategoriesPage.jsx` pattern. A dedicated admin page for product registration with a category `<select>` dropdown fetched from `GET /api/categories`.
- **Form preservation**: On validation error, the backend returns 400 and the frontend keeps all form field values as-is, showing the error message inline.
- **API client**: Add `createProduct(data)` function to `api/client.js`.

### 4. Migration: New SQL file `002_create_products.sql`
- **Why**: Consistent with the existing migration pattern (`001_create_categories.sql`). Timestamped SQL files applied in order by the migration runner.

## Risks / Trade-offs

- **[Risk] Category deleted between form load and submission**: An admin opens the form, the category dropdown loads, but another admin archives/deletes the category before submission. → **Mitigation**: Application-level validation on `POST` re-checks category existence. The FK constraint is the final safeguard.
- **[Risk] Negative stock values**: Price or stock could be entered as negative. → **Mitigation**: `CHECK (stock >= 0)` constraint and frontend validation (`min="0"` on number inputs, `step="0.01"` for price).
- **[Risk] No product listing (separate change)**: The admin can register products but cannot see or manage them yet. → **Mitigation**: This is intentional — product listing is a separate change to keep scope small per the SDD process.

## Open Questions

- Should the name field have a uniqueness constraint (global or per-category)? The EARS spec doesn't mention it, so we can defer to a later change.
