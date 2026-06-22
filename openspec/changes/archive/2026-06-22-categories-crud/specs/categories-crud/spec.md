## ADDED Requirements

### Requirement: Admin access to category management
WHILE the user is authenticated with the Admin role, the system SHALL enable and display the category management panel.

#### Scenario: Admin accesses category management
- **WHEN** an authenticated Admin navigates to the category management section
- **THEN** the system displays the full category management interface with list, create, edit, and delete controls

#### Scenario: Non-admin user cannot access category management
- **WHEN** a user with Cashier or Cook role attempts to access the category management page or API
- **THEN** the system returns a 403 Forbidden response and hides the navigation entry

#### Scenario: Unauthenticated request is rejected
- **WHEN** an unauthenticated request is made to any category management endpoint
- **THEN** the system returns a 401 Unauthorized response

### Requirement: Create product category
WHEN the Admin completes the category registration form and clicks "Save Category", the system SHALL validate the input, persist the category, and update the visible catalog.

#### Scenario: Successful category creation
- **WHEN** the Admin submits a category with name "Bebidas", description "Cold and hot drinks", and an optional image URL
- **THEN** the system creates the category with status active, returns the created category, and the new category appears immediately in the kiosk menu

#### Scenario: Category name too short
- **WHEN** the Admin submits a category with a name of 2 characters
- **THEN** the system rejects the request with a validation error indicating the name must be between 3 and 30 characters

#### Scenario: Category name too long
- **WHEN** the Admin submits a category with a name of 31 characters
- **THEN** the system rejects the request with a validation error indicating the name must be between 3 and 30 characters

#### Scenario: Category name with invalid special characters
- **WHEN** the Admin submits a category with a name containing special characters like "@" or "#"
- **THEN** the system rejects the request with a validation error indicating the name contains invalid characters

### Requirement: Duplicate category name detection
IF the Admin attempts to register a category with a name that already exists in the database, THEN the system SHALL block the save, retain the form data, and display the error message: "The category is already registered".

#### Scenario: Case-insensitive duplicate detection
- **WHEN** the Admin submits a category with name "bebidas" and a category named "Bebidas" already exists
- **THEN** the system detects the duplicate (case-insensitive), rejects the save, and shows "The category is already registered"

#### Scenario: Exact match duplicate detection
- **WHEN** the Admin submits a category with name "Snacks" and a category named "Snacks" already exists
- **THEN** the system rejects the save and shows "The category is already registered"

#### Scenario: Duplicate error highlights name field
- **WHEN** the system rejects a category due to duplicate name
- **THEN** the name input field is highlighted in red to visually alert the Admin

### Requirement: Update category with cascade rename
WHEN the Admin updates a category's name, the system SHALL cascade the rename to all products associated with that category.

#### Scenario: Rename category cascades to products
- **WHEN** the Admin renames category "Bebidas" to "Bebidas y Jugos"
- **THEN** the category name is updated in the categories table and all products with that category_id now display the new category name

#### Scenario: Update category description and image
- **WHEN** the Admin updates the description and image URL of an existing category without changing its name
- **THEN** only the description and image fields are updated; the name and product associations remain unchanged

### Requirement: Delete empty category
WHEN the Admin deletes a category that has no associated products, the system SHALL permanently remove it from the database.

#### Scenario: Successful deletion of empty category
- **WHEN** the Admin deletes a category that has zero associated products
- **THEN** the system permanently removes the category and returns a success confirmation

### Requirement: Restrict deletion of category with products
IF the Admin attempts to delete a category that has one or more associated products, THEN the system SHALL prevent physical deletion and display the alert: "Cannot delete the category because it contains active products".

#### Scenario: Delete blocked for category with products
- **WHEN** the Admin deletes a category that has 3 associated products
- **THEN** the system checks the product count before any delete operation, aborts the transaction, and displays "Cannot delete the category because it contains active products"

#### Scenario: Admin offered archive alternative
- **WHEN** the system blocks deletion of a category with products
- **THEN** the UI displays an option to archive (deactivate) the category instead of deleting it

### Requirement: Archive category
WHEN the Admin archives a category, the system SHALL set its status to inactive without removing it from the database, and the category SHALL be hidden from the kiosk menu.

#### Scenario: Archive category hides from kiosk
- **WHEN** the Admin archives a category that has associated products
- **THEN** the category's is_active flag is set to false, the category is hidden from the kiosk menu, but products referencing it retain their category_id

#### Scenario: Archived category not shown in active lists
- **WHEN** the Admin views the category list with an active-only filter
- **THEN** archived (inactive) categories are excluded from the list by default

#### Scenario: Admin can view archived categories
- **WHEN** the Admin enables "Show archived" in the category management panel
- **THEN** archived categories are displayed with an "Archived" badge

### Requirement: List categories for kiosk
WHEN the kiosk loads, the system SHALL fetch and display only active categories in the defined order, each showing their associated products.

#### Scenario: Kiosk displays active categories
- **WHEN** the self-service kiosk page loads
- **THEN** the system returns only categories with is_active = true and their products, ordered for display
