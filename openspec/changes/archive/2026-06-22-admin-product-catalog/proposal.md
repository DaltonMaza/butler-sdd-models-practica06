## Why

The Butler bar currently has backend APIs for product and category CRUD, but no admin interface to manage the catalog. Staff must interact with the database directly to add, edit, or remove products. This creates operational bottlenecks and risk of data corruption. An admin UI is needed to empower bar staff to manage the product catalog efficiently.

## What Changes

- New standalone admin page at `/admin/products` for product catalog management
- Real-time search and category filter for browsing products
- Product table with image thumbnails, stock alerts ("Agotado" / "Bajo Stock"), and action buttons
- Modal-based product creation and editing form with full validation
- Custom confirmation dialog for safe product deletion (no browser `confirm()`)
- Toast notifications for success/error feedback
- Skeleton loading screens, empty state, and network error handling
- Minor backend tweaks: filtered product list endpoint with search + category filter query params; stock alert indicators in response

## Capabilities

### New Capabilities
- `product-catalog-admin`: Admin product catalog management UI — listing, search, filter, create, edit, delete with modals, validation, stock alerts, UI states (loading, empty, error), and toast notifications

### Modified Capabilities
- `product-registration`: Extend existing product registration spec to include updated frontend validation rules (price > 0, stock >= 0, name 3-50 chars, description max 200 chars) and backend search/filter query support

## Non-goals

- User authentication and role-based access control (covered by separate auth change)
- Category management UI (covered by existing categories-crud)
- Kiosk menu or student-facing product display
- Real-time inventory sync via Socket.io
- Image upload to S3 (URL-based only, placeholder for missing images)

## Impact

- **Frontend**: New React route (`/admin/products`), new components (ProductTable, ProductFormModal, ConfirmDialog, Toast, SearchBar, CategoryFilter, SkeletonRow), new API service module for product endpoints
- **Backend**: Minor additions — search query param on GET /products, category filter param, stock alert computed field in response. No new database migrations needed.
- **Existing specs**: Minor delta to `product-registration` for updated frontend validation rules
