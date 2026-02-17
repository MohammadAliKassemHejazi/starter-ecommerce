import { test, expect } from '@playwright/test';

test.describe('Users Management', () => {
  test('should display users list with correct data', async ({ page }) => {
    // Mock Session (Super Admin)
    await page.route('**/user/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'admin-id',
              email: 'admin@admin.com',
              name: 'Super Admin',
              role: 'SUPER_ADMIN'
            },
            isAuthenticated: true,
            accessToken: 'fake-token'
          }
        })
      });
    });

    // Mock Users List (THE CRITICAL PART)
    // This mocks the response shape I implemented in the backend
    await page.route('**/users?createdById=me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'user-1',
              name: 'Test User 1',
              email: 'user1@test.com',
              createdAt: '2023-01-01T00:00:00Z',
              role: { name: 'Customer' }, // Mapped from roles[0]
              isActive: true // Added field
            },
            {
              id: 'user-2',
              name: 'Test User 2',
              email: 'user2@test.com',
              createdAt: '2023-01-02T00:00:00Z',
              role: { name: 'Admin' },
              isActive: true
            }
          ]
        })
      });
    });

    // Mock User Package
    await page.route('**/packages/active', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: {} }) });
    });

    // Mock Translations (often loaded)
    await page.route('**/api/translations**', async (route) => {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true, data: [] }) });
    });

    // Visit Users Page
    await page.goto('/users');

    // Verification
    // Check if the table is visible
    await expect(page.locator('table')).toBeVisible();

    // Check headers
    await expect(page.locator('th').filter({ hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Role' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Status' })).toBeVisible();

    // Check data rows
    await expect(page.getByText('Test User 1')).toBeVisible();
    await expect(page.getByText('user1@test.com')).toBeVisible();
    // Role badge usually uses standard colors and text
    await expect(page.getByText('Customer', { exact: true })).toBeVisible();
    // Status badge
    await expect(page.getByText('Active', { exact: true }).first()).toBeVisible();

    await expect(page.getByText('Test User 2')).toBeVisible();
    await expect(page.getByText('Admin', { exact: true })).toBeVisible();
  });
});
