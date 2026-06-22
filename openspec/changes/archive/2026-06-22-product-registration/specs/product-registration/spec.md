## ADDED Requirements

### Requirement: Register product in existing category
WHEN the Admin completes the product form with valid data selecting a registered category and clicks "Save Product", the system SHALL persist the product information in the relational database, associating it via its foreign key.

#### Scenario: Successful product registration
- **WHEN** the Admin submits a product with name "Cola Cola 355ml", price 1.50, stock 100, image_url, and category_id referencing an existing active category
- **THEN** the system creates the product with status active, returns the created product including its category_id, and the product is persisted in the database

#### Scenario: Product registration with minimum required fields
- **WHEN** the Admin submits a product with only name, price, stock, and category_id (no description or image_url)
- **THEN** the system creates the product with empty defaults for omitted optional fields

#### Scenario: Product registration with zero initial stock
- **WHEN** the Admin submits a product with stock = 0
- **THEN** the system creates the product successfully with stock = 0

### Requirement: Reject registration with nonexistent or invalid category
IF the Admin attempts to register a product with a category_id that does not exist or is null, THEN the system SHALL deny the save, block the database transaction, and return the error message: "La categoría seleccionada no existe".

#### Scenario: Product registration with nonexistent category UUID
- **WHEN** the Admin submits a product with a category_id that does not match any record in the categories table
- **THEN** the system returns HTTP 400 with error "La categoría seleccionada no existe" and the form data is preserved

#### Scenario: Product registration with null category_id
- **WHEN** the Admin submits a product without specifying a category_id
- **THEN** the system returns HTTP 400 with error "La categoría seleccionada no existe"

#### Scenario: Database-level FK constraint prevents orphaned records
- **WHEN** a direct SQL INSERT attempts to create a product with a nonexistent category_id bypassing application validation
- **THEN** the database rejects the INSERT due to the foreign key constraint violation

### Requirement: Validate required product fields
WHEN the Admin submits the product form, the system SHALL validate that name, price, stock, and category_id are present and meet format requirements.

#### Scenario: Missing product name
- **WHEN** the Admin submits a product without a name
- **THEN** the system returns HTTP 400 with a validation error indicating name is required

#### Scenario: Negative price value
- **WHEN** the Admin submits a product with a negative price
- **THEN** the system returns HTTP 400 with a validation error indicating price must be a positive number

#### Scenario: Negative stock value
- **WHEN** the Admin submits a product with a negative stock value
- **THEN** the system returns HTTP 400 with a validation error indicating stock cannot be negative

#### Scenario: Form data preserved on validation error
- **WHEN** the Admin submits a product with invalid data (e.g., missing name) and the system rejects it
- **THEN** all previously entered form fields retain their values so the Admin can correct and resubmit without re-entering data
