## Context

The Butler bar currently has backend CRUD APIs for products and categories but no admin interface. Staff manage products through direct database access. This change adds a React-based admin UI at `/admin/products` with real-time search, category filtering, modal-based create/edit forms, custom confirmation dialogs, and comprehensive UI state handling (loading, empty, error, success).

## Goals / Non-Goals

**Goals:**
- Functional admin page for product catalog management
- Real-time client-side search and category filtering
- Modal-based product creation and editing with full validation
- Custom confirmation dialog for deletion (no browser confirm())
- Toast notifications for operation feedback
- All UI states handled: loading, empty, error, success
- Minimal backend changes: search/filter query params on GET /products
- Responsive layout adapting to different screen sizes

**Non-Goals:**
- User authentication (handled separately)
- Category management (existing change)
- Image upload (URL-based only)
- Real-time sync via Socket.io
- Kiosk/student-facing product display

## Decisions

### 1. Component architecture: Feature-based colocation
Organize components by feature under `src/pages/admin/products/` rather than a flat `components/` directory. Keeps related files close and makes the page self-contained.

```
src/pages/admin/products/
├── index.jsx          # Page component (orchestrator)
├── ProductTable.jsx   # Table with rows, stock alerts, actions
├── ProductFormModal.jsx  # Create/Edit modal form
├── ConfirmDialog.jsx     # Custom delete confirmation
├── SearchBar.jsx         # Real-time search input
├── CategoryFilter.jsx    # Category dropdown filter
├── Toast.jsx             # Toast notification component
├── SkeletonRow.jsx       # Loading skeleton rows
├── EmptyState.jsx        # Empty/no-results state
└── useProducts.js        # Custom hook for data fetching + state
```

### 2. State management: Custom hook (no Redux/Zustand)
Use a single `useProducts` custom hook encapsulating all data fetching, filtering, mutation, and UI state (loading/error/success). This page doesn't share state across routes — a hook is sufficient and avoids dependency overhead.

### 3. API search/filter: Query parameters on existing endpoint
Extend `GET /products` with optional `?search=` and `?categoryId=` query params. The backend performs case-insensitive `ILIKE` search on name/description. This avoids creating new endpoints while enabling server-side filtering.

### 4. Modal pattern: Portal-based overlay
Use React Portal to render the modal overlay outside the normal DOM hierarchy, ensuring proper z-index stacking and avoiding CSS conflicts with the table layout.

### 5. Toast system: Simple state-based, not a library
A lightweight toast component managed by a `toast` state in the hook. Auto-dismiss via `setTimeout` after 3 seconds. No external toast library needed for a single-page feature.

### 6. Custom confirmation dialog (not browser confirm())
A small modal component with "Confirmar" and "Cancelar" buttons, rendered via portal. The product name is interpolated into the message. No `alert()` or `confirm()` usage.

### 7. Backend stock alert field
The API response includes a computed `stockAlert` field: `"agotado"` (stock = 0), `"bajo"` (1-5), or `null` (> 5). This avoids client-side computation of the alert state and makes the backend the source of truth.

### 8. Tailwind CSS for all styling
Consistent with the existing stack. The wireframe layout uses Tailwind's grid/flex utilities for the responsive two-section layout (controls panel + table).

## Risks / Trade-offs

- **[Risk] Search/filter performance degrades with large catalogs** → Mitigation: Backend query uses ILIKE with indexed columns. If the catalog exceeds 1000 products, consider debouncing the search input (300ms) and adding pagination.
- **[Risk] Modal form data loss on accidental close** → Mitigation: No "are you sure?" warning (keeps UX simple). Form data persists in component state until modal is explicitly submitted or closed.
- **[Risk] Network error during save loses user input** → Mitigation: Modal stays open with all data preserved on error. The user can retry without re-entering.
- **[Trade-off] Client-side filtering vs server-side** → Using server-side for API calls but also maintaining client-side state for responsiveness. On search input, debounce then trigger API call; while waiting, show cached results.
