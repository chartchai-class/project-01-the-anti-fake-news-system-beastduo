import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Comment badges display', () => {
  test('comments show correct badges based on isFake property', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Wait for comments section to load
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()
    
    // Check that comments list is visible
    const commentsList = page.getByTestId('comments-list')
    await expect(commentsList).toBeVisible()

    // Get all comment items
    const commentItems = commentsList.locator('li')
    await expect(commentItems.first()).toBeVisible()

    // Check that badges are displayed for comments with isFake property
    const fakeBadges = page.locator('[aria-label="Fake"]')
    const nonFakeBadges = page.locator('[aria-label="Non-fake"]')
    
    // At least one badge should be visible (from mock data)
    await expect(fakeBadges.or(nonFakeBadges).first()).toBeVisible()
  })

  test('comment badges have correct styling and text', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check fake badge styling and text
    const fakeBadge = page.locator('[aria-label="Fake"]').first()
    if (await fakeBadge.isVisible()) {
      await expect(fakeBadge).toHaveText('Fake')
      await expect(fakeBadge).toHaveClass(/bg-\[#e10600\]\/10/)
      await expect(fakeBadge).toHaveClass(/text-\[#e10600\]/)
    }

    // Check non-fake badge styling and text
    const nonFakeBadge = page.locator('[aria-label="Non-fake"]').first()
    if (await nonFakeBadge.isVisible()) {
      await expect(nonFakeBadge).toHaveText('Non‑fake')
      await expect(nonFakeBadge).toHaveClass(/bg-\[#002b5c\]\/10/)
      await expect(nonFakeBadge).toHaveClass(/text-\[#038619\]/)
    }
  })

  test('new comments get correct badges when submitted with vote', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Count initial comments
    const initialComments = page.locator('[data-testid="comments-list"] li')
    const initialCount = await initialComments.count()

    // Go to vote page and submit a fake vote with comment
    await page.getByRole('link', { name: 'Vote' }).click()
    await page.getByRole('radio', { name: 'Fake', exact: true }).check()
    await page.fill('#comment', 'Test comment for fake badge')
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // Wait for redirect back to details page
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that new comment has fake badge
    const newFakeBadge = page.locator('[aria-label="Fake"]').last()
    await expect(newFakeBadge).toBeVisible()
    await expect(newFakeBadge).toHaveText('Fake')

    // Submit another vote with non-fake and comment
    await page.getByRole('link', { name: 'Vote' }).click()
    await page.getByRole('radio', { name: 'Non-fake', exact: true }).check()
    await page.fill('#comment', 'Test comment for non-fake badge')
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // Wait for redirect back to details page
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that new comment has non-fake badge
    const newNonFakeBadge = page.locator('[aria-label="Non-fake"]').last()
    await expect(newNonFakeBadge).toBeVisible()
    await expect(newNonFakeBadge).toHaveText('Non‑fake')
  })
})
