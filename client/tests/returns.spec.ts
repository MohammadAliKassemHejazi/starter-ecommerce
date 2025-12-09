import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData } from './mocks';

test.describe('Returns Management', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
    await mockLogin(page);

    // Mock Returns List
    await page.route('**/api/returns*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            success: true,
            data: [
                {
                  id: 'ret1',
                  orderId: 'ord1',
                  status: 'PENDING',
                  reason: 'Defective',
                  refundAmount: 99.99,
                  user: { name: 'John Doe' }
                }
            ]
            })
        });
    });
  });

  test('should list return requests', async ({ page }) => {
    await page.goto('/returns');
    // The previous error showed multiple 'PENDING' texts (badge, option, etc.)
    // We specifically want the status badge in the table.
    // Assuming it uses a badge class or is inside a cell.

    // Trying to find the status badge specifically, or just the cell
    await expect(page.locator('span.badge').filter({ hasText: 'PENDING' })).toBeVisible();

    await expect(page.getByText('Defective')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();
  });
});
