import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Promotions Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Promotions List
    await page.route('**/api/promotions*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            success: true,
            data: [
                { id: 'prom1', code: 'SAVE10', type: 'PERCENTAGE', value: 10, isActive: true }
            ]
            })
        });
    });
  });

  test('should list promotions', async ({ page }) => {
    await page.goto('/promotions');
    await expect(page.getByText('SAVE10')).toBeVisible();
    // Use a more specific locator to avoid matching '10%' or other '10's
    // Assuming the value is in a table cell or a specific container.
    // Since we don't know the exact DOM, we'll try to be more specific or use .first() if appropriate,
    // but better to target the structure.
    // If it's a value 10, it might be just "10" text node.
    // Let's try to match it combined with context if possible, or just exact match if that was the issue.
    // The previous error was "resolved to 2 elements ... SAVE10 ... 10%".
    // So we want the one that effectively represents the Value column.

    // Attempting to find the cell that contains exactly '10' or matches the value logic
    await expect(page.getByRole('cell', { name: '10', exact: true })).toBeVisible();
  });
});
