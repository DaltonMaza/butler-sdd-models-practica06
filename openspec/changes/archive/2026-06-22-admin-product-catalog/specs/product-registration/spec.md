## MODIFIED Requirements

### Requirement: Validate required product fields
WHEN the Admin submits the product form, the system SHALL validate that name, price, stock, and category_id are present and meet format requirements.

#### Scenario: Missing product name
- **WHEN** the Admin submits a product without a name
- **THEN** the system returns HTTP 400 with a validation error indicating name is required

#### Scenario: Product name out of length range
- **WHEN** the Admin submits a product with a name shorter than 3 characters or longer than 50 characters
- **THEN** the system returns HTTP 400 with a validation error indicating name must be between 3 and 50 characters

#### Scenario: Negative price value
- **WHEN** the Admin submits a product with a price of 0 or less
- **THEN** the system returns HTTP 400 with a validation error indicating price must be a positive number greater than zero

#### Scenario: Negative stock value
- **WHEN** the Admin submits a product with a negative stock value
- **THEN** the system returns HTTP 400 with a validation error indicating stock cannot be negative

#### Scenario: Form data preserved on validation error
- **WHEN** the Admin submits a product with invalid data and the system rejects it
- **THEN** all previously entered form fields retain their values so the Admin can correct and resubmit

### Requirement: Description length validation
WHEN the Admin submits a product with a description, the system SHALL enforce a maximum of 200 characters.

#### Scenario: Description exceeds maximum length
- **WHEN** the Admin submits a product with a description longer than 200 characters
- **THEN** the system returns HTTP 400 with a validation error indicating description must be 200 characters or fewer

### Requirement: List products with search and category filter
WHEN the Admin or kiosk loads the product list, the system SHALL support optional `search` and `categoryId` query parameters to filter results.

#### Scenario: Search by name or description
- **WHEN** a GET /products request includes `?search=hamburguesa`
- **THEN** the system returns only products whose name or description contains "hamburguesa" (case-insensitive)

#### Scenario: Filter by category
- **WHEN** a GET /products request includes `?categoryId=<uuid>`
- **THEN** the system returns only products belonging to that category

#### Scenario: Combined search and category filter
- **WHEN** a GET /products request includes `?search=papa&categoryId=<uuid>`
- **THEN** the system returns only matching products within that category
