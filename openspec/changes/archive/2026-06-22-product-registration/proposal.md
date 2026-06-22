## Why

The admin needs to register products in the kiosk catalog, each strictly associated with an existing category. Currently no product registration exists — the `categories` table and API are ready from the previous change, but there is no way to create products. This change enables admins to add products to the catalog with guaranteed category validity.

## What Changes

- **Backend**: REST API endpoint for product registration with category existence validation
- **Frontend**: Admin product registration form with category selector
- **Database**: New `products` table with foreign key constraint to `categories`
- **Validation**: Category existence check before persistence; FK constraint at DB level as safety net
- **Error handling**: 400 Bad Request with message "La categoría seleccionada no existe" when category is invalid; form data preserved on error

## Capabilities

### New Capabilities
- `product-registration`: Register new products in the catalog — create a product with name, description, price, image URL, and stock, associated to an existing category via its ID, with full validation

### Modified Capabilities
<!-- No existing capabilities have their requirements changed -->

## Impact

- **Database**: New `products` table (`id`, `name`, `description`, `price`, `image_url`, `stock`, `category_id` FK → `categories.id`, `is_active`, `created_at`, `updated_at`)
- **Backend**: New route `POST /api/products`; category existence validation middleware; FK constraint in migration
- **Frontend**: New admin page for product registration form with category dropdown (populated from `GET /api/categories`)
- **Docs**: API endpoint documentation for product creation

## Non-goals

- Product listing, editing, deletion, or search (separate changes)
- Product image upload (assumes URL-based image reference only)
- Category management (already handled by categories-crud)
- Bulk product import or CSV upload
- Stock management beyond initial registration quantity
