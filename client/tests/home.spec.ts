import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display hero section and new sections', async ({ page }) => {
    // Mock the public API responses
    await page.route('**/api/public/stores', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            data: [
                { id: '1', name: 'Tech Store', description: 'Best tech', logo: '/tech.jpg' },
                { id: '2', name: 'Fashion Hub', description: 'Stylish clothes', logo: '/fashion.jpg' },
                { id: '3', name: 'Home Depot', description: 'Home goodies', logo: '/home.jpg' },
                { id: '4', name: 'Sports Gear', description: 'Get active', logo: '/sports.jpg' },
            ]
        }),
      });
    });

    await page.route('**/api/public/articles', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            data: [
                { id: '1', title: 'Summer Trends', text: 'Hot summer styles...', createdAt: new Date().toISOString(), User: { name: 'Editor' } },
                { id: '2', title: 'Tech News', text: 'New gadgets...', createdAt: new Date().toISOString(), User: { name: 'Techie' } },
                { id: '3', title: 'Healthy Living', text: 'Tips for health...', createdAt: new Date().toISOString(), User: { name: 'Dr. Good' } },
            ]
        }),
      });
    });

    await page.route('**/api/public/products*', async (route) => {
         await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            data: [],
            meta: { page: 1, pageSize: 10, total: 0, totalPages: 0 }
        }),
      });
    });

    await page.goto('/');

    // Check Hero Section (Bubbles/Stars) - usually canvas or specific structure,
    // but we can check if the header exists
    await expect(page.locator('header')).toBeVisible();

    // Check Featured Stores
    await expect(page.getByText('Featured Stores')).toBeVisible();
    await expect(page.getByText('Tech Store')).toBeVisible();
    await expect(page.getByText('Fashion Hub')).toBeVisible();

    // Check Promotional Banner
    await expect(page.getByText('Summer Sale is Live!')).toBeVisible();

    // Check Latest Articles
    await expect(page.getByText('Latest News')).toBeVisible();
    await expect(page.getByText('Summer Trends')).toBeVisible();
    await expect(page.getByText('Tech News')).toBeVisible();
  });
});
