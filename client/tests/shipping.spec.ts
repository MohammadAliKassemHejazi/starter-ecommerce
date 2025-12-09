import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Shipping Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Shipping Methods List
    await page.route('**/api/shipping/methods*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            success: true,
            data: [
                { id: 'ship1', name: 'Standard Delivery', cost: 10.00, deliveryEstimate: '3-5 Days' },
                { id: 'ship2', name: 'Express', cost: 25.00, deliveryEstimate: '1 Day' }
            ]
            })
        });
    });
  });

  test('should list shipping methods', async ({ page }) => {
    await page.goto('/shipping');
    await expect(page.getByText('Standard Delivery')).toBeVisible();
    await expect(page.getByText('3-5 Days')).toBeVisible();
    await expect(page.getByText('$10.00')).toBeVisible();
  });
});
