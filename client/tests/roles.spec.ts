import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Roles Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Roles List
    await page.route('**/api/roles*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            success: true,
            data: [
                { id: 'role1', name: 'SUPER_ADMIN' },
                { id: 'role2', name: 'CUSTOMER' }
            ]
            })
        });
    });
  });

  test('should list roles', async ({ page }) => {
    await page.goto('/roles');
    await expect(page.getByText('SUPER_ADMIN')).toBeVisible();
    await expect(page.getByText('CUSTOMER')).toBeVisible();
  });
});
