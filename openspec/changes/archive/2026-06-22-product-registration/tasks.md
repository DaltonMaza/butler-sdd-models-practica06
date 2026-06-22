## 1. Database migration

- [x] 1.1 Create `migrations/002_create_products.sql` with `products` table (id UUID PK, name VARCHAR(100) NOT NULL, description TEXT DEFAULT '', price NUMERIC(10,2) NOT NULL CHECK (price >= 0), image_url TEXT DEFAULT '', stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())

## 2. Backend — products API

- [x] 2.1 Create `src/routes/products.js` Express router with `authenticate` + `requireAdmin` middleware
- [x] 2.2 Implement `POST /api/products` — validates required fields (name, price, stock, category_id); checks category exists and is active (`SELECT id FROM categories WHERE id = $1 AND is_active = true`); returns 400 with "La categoría seleccionada no existe" on invalid category; inserts product and returns 201 with created record
- [x] 2.3 Register products router in `src/routes/index.js` (`router.use('/products', productsRouter)`)

## 3. Frontend — admin product registration form

- [x] 3.1 Add `createProduct(data)` function to `src/api/client.js`
- [x] 3.2 Create `src/pages/admin/ProductRegistrationPage.jsx` — form with fields (name, description, price, stock, image_url, category_id dropdown); category dropdown populated from `GET /api/categories`; client-side validation (required fields, non-negative price/stock); on validation error, preserve all form values and show inline error message
- [x] 3.3 Add route for product registration page in admin router (e.g., `/admin/products/new`) with navigation link from admin panel

## 4. Testing

- [x] 4.1 Write backend unit tests for product validation rules (required fields, non-negative price/stock, category existence check)
- [x] 4.2 Write frontend unit tests for ProductRegistrationPage form validation logic (required fields, number constraints, form preservation on error)
