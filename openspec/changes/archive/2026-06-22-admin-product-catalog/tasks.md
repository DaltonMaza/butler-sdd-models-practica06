## 1. Backend: Search and Filter Support

- [x] 1.1 Add `search` and `categoryId` query params to GET /products route with ILIKE search on name/description
- [x] 1.2 Add computed `stock_alert` field to GET /products response (`agotado` for 0, `bajo` for 1-5, null otherwise)
- [x] 1.3 Update POST /products validation: price > 0 (was >= 0), name length 3-50, description max 200 chars
- [x] 1.4 Update backend integration tests for new query params and validation rules

## 2. Frontend: API Client and Routing

- [x] 2.1 Create `frontend/src/api/products.js` with functions: getProducts, getProduct, createProduct, updateProduct, deleteProduct
- [x] 2.2 Add `/admin/products` route to the frontend router configuration

## 3. Frontend: Product Catalog Page Components

- [x] 3.1 Create `useProducts` custom hook encapsulating data fetching, search/filter state, CRUD mutations, and UI state (loading/error/success)
- [x] 3.2 Create `SearchBar` component with debounced real-time search input
- [x] 3.3 Create `CategoryFilter` component that loads categories dynamically
- [x] 3.4 Create `ProductTable` component with columns: image, name, category, price, stock, stock alert, actions
- [x] 3.5 Create `SkeletonRow` component for loading state
- [x] 3.6 Create `EmptyState` component for empty/no-results state
- [x] 3.7 Create `Toast` component with auto-dismiss after 3 seconds
- [x] 3.8 Reuse existing `ConfirmDialog` component for safe deletion (custom, no browser confirm)

## 4. Frontend: Product Form Modal

- [x] 4.1 Create `ProductFormModal` component with portal-based overlay and all form fields
- [x] 4.2 Implement real-time validation: name 3-50 chars, price > 0, stock >= 0, description max 200, category required
- [x] 4.3 Wire modal for create (blank form) and edit (pre-filled) modes
- [x] 4.4 Handle category dropdown loading and required-field validation on submit

## 5. Frontend: Product Catalog Page Integration

- [x] 5.1 Create `ProductCatalogPage` orchestrator component at `frontend/src/pages/admin/ProductCatalogPage.jsx`
- [x] 5.2 Assemble SearchBar, CategoryFilter, ProductTable, and "Nuevo Producto" button in the page layout
- [x] 5.3 Wire all CRUD operations: create, edit, delete with modal forms and toast notifications
- [x] 5.4 Implement network error state: freeze form, preserve data, show error banner with retry
- [x] 5.5 Verify responsive layout and touch-friendly interactions for tablet screens

## 6. Cleanup and Verification

- [x] 6.1 Update or deprecate existing `ProductRegistrationPage.jsx` in favor of the new catalog page
- [x] 6.2 Run frontend tests and verify no regressions
- [x] 6.3 Verify no business rule violations (e.g., product without category cannot be saved)
