import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should show sign-in form', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await expect(page.locator('h1')).toContainText('Sign in');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show sign-up form', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page.locator('h1')).toContainText('Sign up');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="handle"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate sign-up form', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Try to submit without filling form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Handle is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should navigate between sign-in and sign-up', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/auth/signup');
    
    await page.click('text=Sign in');
    await expect(page).toHaveURL('/auth/signin');
  });
});