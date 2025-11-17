import { test, expect } from '@playwright/test';

test.describe('E2E: Basic Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('unauthenticated user cannot access /projects', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user cannot access /tasks', async ({ page }) => {
    await page.goto('/tasks');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated user cannot access /users', async ({ page }) => {
    await page.goto('/users');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    expect(page.url()).toContain('/login');
    // Check for login form elements
    const hasEmailInput = await page.locator('input[name="email"]').isVisible({ timeout: 2000 }).catch(() => false);
    const hasPasswordInput = await page.locator('input[name="password"]').isVisible({ timeout: 2000 }).catch(() => false);
    expect(hasEmailInput || hasPasswordInput).toBeTruthy();
  });

  test('register page is accessible', async ({ page }) => {
    await page.goto('/register');
    expect(page.url()).toContain('/register');
  });
});
