import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Skeleton loading states', () => {
  test('NewsDetailsPage shows skeleton loading initially', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Check that skeleton loading elements are visible initially
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements.first()).toBeVisible()

    // Wait for content to load (skeleton should disappear)
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    
    // Skeleton elements should no longer be visible after content loads
    await expect(skeletonElements.first()).not.toBeVisible()
  })

  test('VotePage shows skeleton loading initially', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to vote page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'Vote' }).click()

    // Check that skeleton loading elements are visible initially
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements.first()).toBeVisible()

    // Wait for content to load (skeleton should disappear)
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
    
    // Skeleton elements should no longer be visible after content loads
    await expect(skeletonElements.first()).not.toBeVisible()
  })

  test('comments section shows skeleton loading during pagination', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Seed enough comments to enable pagination (page size = 5)
    for (let i = 0; i < 6; i++) {
      await page.getByRole('link', { name: 'Vote' }).click()
      await page.getByRole('radio', { name: 'Fake', exact: true }).check()
      await page.fill('#comment', `Test comment ${i}`)
      await page.getByRole('button', { name: 'Submit Vote' }).click()
      await page.waitForURL('**/news/*', { waitUntil: 'load' })
    }

    // Check that pagination is available
    const pager = page.getByTestId('comments-pager')
    await expect(pager).toBeVisible()

    // Click next page to trigger skeleton loading
    await page.getByRole('button', { name: 'Next comments page' }).click()

    // Check that skeleton loading appears for comments
    const commentsSkeleton = page.getByTestId('comments-skeleton')
    await expect(commentsSkeleton).toBeVisible()

    // Wait for skeleton to disappear and new comments to load
    await expect(commentsSkeleton).not.toBeVisible()
    await expect(page.getByTestId('comments-list')).toBeVisible()
  })

  test('skeleton loading has correct styling and animation', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to vote page to check skeleton styling
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'Vote' }).click()

    // Check skeleton elements have correct classes
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements.first()).toBeVisible()

    // Check that skeleton elements have the animate-pulse class
    const firstSkeleton = skeletonElements.first()
    await expect(firstSkeleton).toHaveClass(/animate-pulse/)
    await expect(firstSkeleton).toHaveClass(/bg-gray-200|bg-gray-100/)
  })

  test('skeleton loading appears when navigating between pages', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to details page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Wait for content to load
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()

    // Navigate to vote page
    await page.getByRole('link', { name: 'Vote' }).click()

    // Check skeleton loading appears
    const skeletonElements = page.locator('.animate-pulse')
    await expect(skeletonElements.first()).toBeVisible()

    // Wait for vote page content to load
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
    await expect(skeletonElements.first()).not.toBeVisible()

    // Navigate back to details page
    await page.getByRole('link', { name: 'Details' }).click()

    // Check skeleton loading appears again
    await expect(skeletonElements.first()).toBeVisible()

    // Wait for details page content to load
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    await expect(skeletonElements.first()).not.toBeVisible()
  })

  test('skeleton loading handles different content types correctly', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to details page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Check that different skeleton elements are present
    const skeletonElements = page.locator('.animate-pulse')
    const skeletonCount = await skeletonElements.count()
    
    // Should have multiple skeleton elements for different content areas
    expect(skeletonCount).toBeGreaterThan(1)

    // Wait for content to load
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    await expect(skeletonElements.first()).not.toBeVisible()
  })
})
