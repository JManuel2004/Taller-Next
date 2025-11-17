import { test, expect } from '@playwright/test';

test.describe('E2E: Dashboard Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard/user');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('should redirect to login when accessing admin dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});
