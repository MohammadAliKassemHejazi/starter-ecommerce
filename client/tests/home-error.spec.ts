import { test, expect } from '@playwright/test';

test.describe('Home Page Error Handling', () => {
  test('should display error messages when API calls fail', async ({ page }) => {
    // Mock the public API responses to fail
    await page.route('**/api/public/stores', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.route('**/api/public/articles', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    // We also need to mock product listing failure
     await page.route('**/api/shop/products*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.goto('/');

    // Check for error messages
    // The DataFetchError component contains text "We encountered a problem"
    // and "We are having trouble loading this content right now. Our team is working on solving it."

    // There should be multiple error messages (for stores, articles, products)
    const errorMessages = page.getByText('We encountered a problem');
    await expect(errorMessages).toHaveCount(3);

    // Check specific error details if possible (depends on how error is passed)
    // In our implementation, we passed the error string.
    // The mock returns "Internal Server Error" (or whatever axios/slice extracts).
    // The slice usually extracts "Failed to fetch ..." or the message from response.

    // Let's check for the general user-friendly message
    await expect(page.getByText('Our team is working on solving it').first()).toBeVisible();
  });
});
