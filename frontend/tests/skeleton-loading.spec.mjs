import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Loading states', () => {
  test('NewsDetailsPage loads data immediately without skeleton', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Data should load immediately without skeleton loading
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    
    // Verify no skeleton elements are present
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements).toHaveCount(0)
  })

  test('VotePage loads data immediately without skeleton', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to vote page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'Vote' }).click()

    // Data should load immediately without skeleton loading
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
    
    // Verify no skeleton elements are present
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements).toHaveCount(0)
  })

  test('immediate loading provides better user experience', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Test that navigation to details page is instant
    const firstCard = page.locator('ul.grid > li').first()
    const startTime = Date.now()
    
    await firstCard.getByRole('link', { name: 'View details' }).click()
    
    // Content should appear immediately
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    
    const loadTime = Date.now() - startTime
    // Should load quickly (realistic expectation)
    expect(loadTime).toBeLessThan(500)
  })

  test('navigation between pages is instant', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Navigate to details page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()

    // Navigate to vote page - should be quick
    const startTime = Date.now()
    await page.getByRole('link', { name: 'Vote' }).click()
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
    
    const loadTime = Date.now() - startTime
    // Should load quickly (realistic expectation)
    expect(loadTime).toBeLessThan(500)
  })
})
