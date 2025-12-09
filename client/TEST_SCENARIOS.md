# Test Scenarios

This document outlines the test scenarios for key pages in the application.

## 1. Shop Page (`/shop`)

**Goal:** Verify that users can browse, filter, and view products.

**Scenarios:**
1.  **View Product List:**
    *   **Action:** Navigate to `/shop`.
    *   **Expected:** A list of products is displayed. Each product card shows an image, name, and price.
2.  **Filter by Category:**
    *   **Action:** Click on a category (e.g., "Electronics") in the sidebar.
    *   **Expected:** Only products belonging to that category are displayed.
3.  **Search Product:**
    *   **Action:** Enter a keyword in the search bar.
    *   **Expected:** The list updates to show products matching the keyword.
4.  **Pagination:**
    *   **Action:** Click on the "Next" page button (if applicable).
    *   **Expected:** The next set of products is loaded.
5.  **View Product Details:**
    *   **Action:** Click on a product card.
    *   **Expected:** User is redirected to the product details page.

## 2. Packages (`/packages`) - Admin/SuperAdmin

**Goal:** Verify the management of subscription packages.

**Scenarios:**
1.  **List Packages:**
    *   **Action:** Navigate to `/packages` (as Admin).
    *   **Expected:** A table or grid of existing packages (e.g., "Starter", "Pro") is displayed.
2.  **Create Package:**
    *   **Action:** Click "Create New Package". Fill in Name, Limits, and Price. Submit.
    *   **Expected:** The new package appears in the list.
3.  **Edit Package:**
    *   **Action:** Click "Edit" on a package. Change the price. Save.
    *   **Expected:** The updated price is reflected in the list.
4.  **Delete Package:**
    *   **Action:** Click "Delete" on a package. Confirm.
    *   **Expected:** The package is removed from the list.

## 3. Permissions (`/permissions`) - SuperAdmin

**Goal:** Verify that system permissions can be viewed and managed.

**Scenarios:**
1.  **View Permissions:**
    *   **Action:** Navigate to `/permissions`.
    *   **Expected:** A comprehensive list of all system permissions (e.g., `READ_PRODUCTS`, `MANAGE_USERS`) is displayed.
2.  **Search/Filter Permissions:**
    *   **Action:** Type a permission name in the filter box.
    *   **Expected:** The list filters to match the input.

## 4. Promotions (`/promotions`) - Admin

**Goal:** Verify the creation and management of discount codes.

**Scenarios:**
1.  **List Promotions:**
    *   **Action:** Navigate to `/promotions`.
    *   **Expected:** A list of active and inactive discount codes is shown.
2.  **Create Promotion:**
    *   **Action:** Click "Add Promotion". Enter Code (e.g., `SAVE10`), Type (Percentage/Fixed), Value, and Validity dates. Submit.
    *   **Expected:** The new code appears in the list.
3.  **Validate Unique Code:**
    *   **Action:** Try to create a promotion with an existing code.
    *   **Expected:** An error message indicates the code already exists.

## 5. Returns (`/returns`) - Admin

**Goal:** Verify the processing of customer return requests.

**Scenarios:**
1.  **View Return Requests:**
    *   **Action:** Navigate to `/returns`.
    *   **Expected:** A list of return requests with status (Pending, Approved, Rejected) is displayed.
2.  **Approve Return:**
    *   **Action:** Select a "Pending" return. Click "Approve".
    *   **Expected:** The status changes to "Approved".
3.  **Reject Return:**
    *   **Action:** Select a "Pending" return. Click "Reject".
    *   **Expected:** The status changes to "Rejected".

## 6. Roles (`/roles`) - SuperAdmin

**Goal:** Verify the management of user roles and their associated permissions.

**Scenarios:**
1.  **List Roles:**
    *   **Action:** Navigate to `/roles`.
    *   **Expected:** Standard roles (Admin, Customer) and custom roles are listed.
2.  **Create Role:**
    *   **Action:** Click "Create Role". Enter Name (e.g., "Manager"). Select permissions. Save.
    *   **Expected:** The new role is created.
3.  **Edit Role Permissions:**
    *   **Action:** Edit an existing role. Add or remove a permission. Save.
    *   **Expected:** The role's permissions are updated.

## 7. Shipping (`/shipping`) - Admin

**Goal:** Verify shipping method configuration.

**Scenarios:**
1.  **List Shipping Methods:**
    *   **Action:** Navigate to `/shipping`.
    *   **Expected:** Available shipping methods (e.g., "Standard", "Express") and their costs are listed.
2.  **Add Shipping Method:**
    *   **Action:** Click "Add Method". Enter Name, Cost, and Delivery Estimate. Save.
    *   **Expected:** The new method appears in the list.
3.  **Update Cost:**
    *   **Action:** Edit a method. Change the cost. Save.
    *   **Expected:** The cost is updated.
