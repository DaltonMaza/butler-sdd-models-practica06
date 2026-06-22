## ADDED Requirements

### Requirement: Load product catalog on page mount
WHILE the admin product catalog page is open, the system SHALL asynchronously render the full product list and the active category list for dropdowns.

#### Scenario: Page loads with existing products
- **WHEN** the admin navigates to /admin/products
- **THEN** the system fetches all products and categories from the API and renders the product table with category filter populated

#### Scenario: Page loads with no products
- **WHEN** the admin navigates to /admin/products and no products exist
- **THEN** the system displays an empty state message: "No se encontraron productos disponibles. Comienza agregando uno nuevo."

#### Scenario: Loading state shows skeleton screens
- **WHEN** the page is fetching data
- **THEN** the product table renders skeleton rows instead of the table body

### Requirement: Filter products in real-time by name or description
WHEN the admin types in the search input, the system SHALL filter the displayed products by matching name or description without a page reload.

#### Scenario: Search matches product name
- **WHEN** the admin types "Hamburguesa" in the search bar
- **THEN** the table updates to show only products whose name or description contains "Hamburguesa"

#### Scenario: Search with no matches
- **WHEN** the admin types a query that matches no products
- **THEN** the table displays the empty state with the message "No se encontraron productos disponibles."

### Requirement: Filter products by category
WHEN the admin selects a category from the dropdown filter, the system SHALL filter the displayed products to only those in that category.

#### Scenario: Category filter selection
- **WHEN** the admin selects "Bebidas" from the category dropdown
- **THEN** the table updates to show only products in the "Bebidas" category

#### Scenario: Category filter reset to "All"
- **WHEN** the admin selects "Todas" (All) from the category dropdown
- **THEN** the table shows all products regardless of category

### Requirement: Open create product modal
WHEN the admin clicks "Nuevo Producto", the system SHALL open a modal with a blank form for creating a new product.

#### Scenario: Create modal opens
- **WHEN** the admin clicks the "Nuevo Producto" button
- **THEN** a modal overlay appears with an empty form containing fields: name, category (dropdown), description, price, stock, image URL

#### Scenario: Create modal is dismissed without saving
- **WHEN** the admin clicks the close button or clicks outside the modal
- **THEN** the modal closes without submitting any data

### Requirement: Create product with valid data
WHEN the admin completes the form with valid data, selects an existing category from the dropdown, and clicks "Guardar", the system SHALL POST to the API, persist the record, close the modal, and refresh the list in the background.

#### Scenario: Successful product creation
- **WHEN** the admin fills all required fields with valid data and clicks "Guardar"
- **THEN** the system sends a POST request, persists the product, closes the modal, refreshes the product list, and displays a green toast: "Producto guardado exitosamente"

#### Scenario: Toast auto-dismisses
- **WHEN** the success toast is displayed
- **THEN** the toast auto-dismisses after 3 seconds

### Requirement: Reject product creation without category selection
IF the admin attempts to submit the form without selecting a category from the dropdown, THEN the system SHALL deny the HTTP request, mark the category field border red, and display the warning: "Es obligatorio asociar el producto a una categoría existente."

#### Scenario: Missing category on create
- **WHEN** the admin clicks "Guardar" with no category selected
- **THEN** the submit is blocked, the category field is highlighted in red, and the error message is shown below the field

### Requirement: Validate numeric fields in real-time
IF the admin enters a value less than or equal to zero in the "Precio" field OR a negative value in the "Stock" field, THEN the system SHALL disable the "Guardar" button and display a red error text next to the affected field.

#### Scenario: Price is zero or negative
- **WHEN** the admin enters "0" or "-1" in the price field
- **THEN** the "Guardar" button is disabled and a red error "El precio debe ser mayor a 0" appears next to the field

#### Scenario: Stock is negative
- **WHEN** the admin enters "-5" in the stock field
- **THEN** the "Guardar" button is disabled and a red error "El stock no puede ser negativo" appears next to the field

### Requirement: Validate product name length
WHEN the admin enters a product name, the system SHALL validate that the name is between 3 and 50 characters.

#### Scenario: Name too short
- **WHEN** the admin enters a name with 2 characters or fewer
- **THEN** the system displays a red error "El nombre debe tener entre 3 y 50 caracteres"

#### Scenario: Name too long
- **WHEN** the admin enters a name with 51 characters or more
- **THEN** the system displays a red error "El nombre debe tener entre 3 y 50 caracteres"

### Requirement: Validate description length
WHEN the admin enters a product description, the system SHALL enforce a maximum of 200 characters.

#### Scenario: Description exceeds limit
- **WHEN** the admin enters a description of 201 characters or more
- **THEN** the system displays a red character counter showing the limit exceeded

### Requirement: Edit existing product
WHEN the admin clicks "Editar" on a product row, the system SHALL open the modal form pre-filled with that product's data.

#### Scenario: Edit modal opens with data
- **WHEN** the admin clicks "Editar" on a product
- **THEN** the modal opens with all fields populated with the product's current values

#### Scenario: Edit modal saves changes
- **WHEN** the admin modifies fields and clicks "Guardar"
- **THEN** the system sends a PUT/PATCH request, updates the product, closes the modal, refreshes the list, and shows a success toast

### Requirement: Delete product with custom confirmation
WHEN the admin clicks "Eliminar" on a product, the system SHALL display a custom floating confirmation card (not browser confirm()) with the message "¿Está seguro de que desea eliminar [Nombre de Producto]? Esta acción no se puede deshacer", with "Confirmar" and "Cancelar" buttons.

#### Scenario: Confirm deletion
- **WHEN** the admin clicks "Confirmar" in the deletion dialog
- **THEN** the system sends a DELETE request, removes the product from the list, and shows a success toast

#### Scenario: Cancel deletion
- **WHEN** the admin clicks "Cancelar" in the deletion dialog
- **THEN** the dialog closes and no action is taken

### Requirement: Show stock alert indicators
WHILE the product table is rendered, the system SHALL display a red "Agotado" label for products with stock = 0 and an orange "Bajo Stock" label for products with stock between 1 and 5.

#### Scenario: Zero stock shows "Agotado"
- **WHEN** a product has stock = 0
- **THEN** the table shows a red "Agotado" badge in the stock alert column

#### Scenario: Low stock shows "Bajo Stock"
- **WHEN** a product has stock between 1 and 5
- **THEN** the table shows an orange "Bajo Stock" badge in the stock alert column

#### Scenario: Sufficient stock shows no alert
- **WHEN** a product has stock > 5
- **THEN** the stock alert column is empty

### Requirement: Show product image thumbnail
WHILE the product table is rendered, the system SHALL display a small image thumbnail for each product, or a placeholder if no image URL is provided.

#### Scenario: Product has image URL
- **WHEN** a product has a non-empty image_url
- **THEN** the table renders a small <img> tag with that URL as src

#### Scenario: Product has no image
- **WHEN** a product has no image_url
- **THEN** the table renders a placeholder image or icon

### Requirement: Handle network errors gracefully
IF the backend does not respond or the connection is lost, THEN the system SHALL freeze form submissions, preserve form data in the modal, and display a red banner: "No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo nuevamente."

#### Scenario: Network error on initial load
- **WHEN** the API returns a network error during page load
- **THEN** the page shows a red error banner with the network error message and a retry button

#### Scenario: Network error during form submission
- **WHEN** a network error occurs while saving a product
- **THEN** the modal stays open with all entered data preserved and a red error banner is shown at the top

### Requirement: Backend supports search and category filter
WHEN the admin uses search or category filter, the system SHALL support query parameters on the GET /products endpoint for server-side filtering.

#### Scenario: Search query parameter
- **WHEN** the admin types in the search bar
- **THEN** the frontend sends GET /products?search=query to the backend

#### Scenario: Category filter parameter
- **WHEN** the admin selects a category
- **THEN** the frontend sends GET /products?categoryId=uuid to the backend

#### Scenario: Combined search and filter
- **WHEN** the admin has both a search term and a category selected
- **THEN** the frontend sends GET /products?search=query&categoryId=uuid
