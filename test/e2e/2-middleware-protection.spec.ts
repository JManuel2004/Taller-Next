import { test, expect } from '@playwright/test';

test.describe('E2E: Middleware & Route Protection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should redirect unauthenticated user from / to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated user from /dashboard/admin to /login', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated user from /dashboard/user to /login', async ({ page }) => {
    await page.goto('/dashboard/user');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated user from /projects to /login', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated user from /users to /login', async ({ page }) => {
    await page.goto('/users');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});
