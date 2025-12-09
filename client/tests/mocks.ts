import { Page } from '@playwright/test';

// Mocks for standard seed data
export const MOCK_USER = {
  id: 'user-123',
  name: 'Super Admin',
  email: 'admin@admin.com',
  role: 'SUPER_ADMIN',
  // Crucial: Simulating the Pro Plan active status
  activePackage: {
    id: 'pkg-123',
    name: 'Pro Plan',
    isActive: true
  }
};

export const MOCK_TOKEN = 'fake-jwt-token-for-testing';

export const mockLogin = async (page: Page) => {
  // Intercept the login endpoint (Client -> Next.js API Route -> Mock)
  // The client calls /api/user/auth/login to the local Next.js API
  await page.route('**/api/user/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        data: {
          token: MOCK_TOKEN,
          user: MOCK_USER
        }
      })
    });
  });

  // Intercept the 'me' or 'profile' endpoint if it exists
  await page.route('**/api/users/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: MOCK_USER
      })
    });
  });

  // Intercept Permissions check
  await page.route('**/api/auth/permissions', async (route) => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            success: true,
            data: ['*'] // Superadmin has all permissions
        })
    })
  })
};

export const mockCommonData = async (page: Page) => {
  // Mock Settings / Configs if needed
  await page.route('**/api/settings', async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ theme: 'light' }) });
  });
};
