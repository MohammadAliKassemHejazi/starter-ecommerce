import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Packages Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Packages List
    await page.route('**/api/packages*', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                success: true,
                data: [
                    { id: 'pkg1', name: 'Starter Plan', price: 0, storeLimit: 1 },
                    { id: 'pkg2', name: 'Pro Plan', price: 29.99, storeLimit: 10 }
                ]
                })
            });
        } else {
            await route.continue();
        }
    });
  });

  test('should list packages', async ({ page }) => {
    await page.goto('/packages');
    await expect(page.getByText('Starter Plan')).toBeVisible();
    await expect(page.getByText('Pro Plan')).toBeVisible();
  });
});
