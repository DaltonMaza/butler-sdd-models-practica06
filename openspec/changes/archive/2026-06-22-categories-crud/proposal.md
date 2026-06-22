## Why

The self-service kiosk needs a categorized menu so students can browse products by type (e.g., "Bebidas", "Snacks", "Platos Fuertes"). Currently there is no category management system — categories are hardcoded or nonexistent. This change enables admins to create, update, archive, and delete product categories, keeping the kiosk organized and maintainable.

## What Changes

- **Backend**: REST API endpoints for full CRUD of product categories
- **Frontend**: Admin panel UI for managing categories (list, create, edit, archive/delete)
- **Database**: New `categories` table with fields: id, name, description, image_url, is_active, created_at, updated_at
- **Cascade**: Renaming a category cascades to all associated products
- **Archive**: Archive (soft-deactivate) categories instead of hard-deleting when they have products; hard-delete allowed for empty categories
- **Kiosk**: Categories drive the navigation/menu organization in the self-service kiosk

## Capabilities

### New Capabilities
- `categories-crud`: Full CRUD management of product categories — create, read, update, archive, and delete with validations, case-insensitive duplicate checking, and cascade rename support

### Modified Capabilities

*(None — first capability for this project)*

## Impact

- **Database**: New `categories` table; products table needs a `category_id` foreign key
- **Backend**: New routes under `/api/categories/`; validation middleware; authorization check for admin role
- **Frontend**: New admin panel page for category listing/form; kiosk header/navigation updated to show categories
- **Docs**: API endpoints need documentation
