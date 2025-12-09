import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Permissions Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Permissions List
    // Note: The service uses /permissions, but in next.js local API it might be /permissions or /admin/permissions depending on proxy.
    // However, looking at the previous failures and the codebase, it seems the service calls `/permissions` relative to base.
    // If base is local API, it's `/api/permissions`.

    await page.route('**/api/permissions*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            success: true,
            data: [
                { id: 'perm1', name: 'READ_PRODUCTS' },
                { id: 'perm2', name: 'MANAGE_USERS' }
            ]
            })
        });
    });
  });

  test('should list permissions', async ({ page }) => {
    await page.goto('/permissions');
    await expect(page.getByText('READ_PRODUCTS')).toBeVisible();
    await expect(page.getByText('MANAGE_USERS')).toBeVisible();
  });
});
