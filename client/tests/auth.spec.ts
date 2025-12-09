import { test, expect } from '@playwright/test';
import { mockLogin, mockCommonData, MOCK_USER } from './mocks';

test.describe('Authentication', () => {

  test.beforeEach(async ({ page }) => {
    await mockCommonData(page);
  });

  test('should allow user to login', async ({ page }) => {
    // Setup Mocks
    await mockLogin(page);

    await page.goto('/auth/signin');

    // Fill login form
    // Note: Selectors depend on the actual implementation.
    // I'm using common conventions. If they fail, I'll need to inspect the code.
    await page.getByPlaceholder('Enter email').fill('admin@admin.com');
    await page.getByPlaceholder('Enter Password').fill('123456');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Verify redirection to home ("/")
    await expect(page).toHaveURL('/');

    // Verify user name might be visible in header
    // await expect(page.getByText(MOCK_USER.name)).toBeVisible();
  });
});
