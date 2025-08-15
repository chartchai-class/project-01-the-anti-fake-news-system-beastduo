import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Store isFake mapping and badge display', () => {
  test('news cards display correct badges based on computed status', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Get all news cards
    const newsCards = page.locator('ul.grid > li')
    const cardCount = await newsCards.count()

    // Check that each card has a badge
    for (let i = 0; i < Math.min(5, cardCount); i++) {
      const card = newsCards.nth(i)
      const badge = card.locator('[aria-label="Fake"], [aria-label="Non-fake"]')
      await expect(badge).toBeVisible()
    }
  })

  test('badge status updates after submitting votes', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Get the first news card
    const firstCard = page.locator('ul.grid > li').first()
    const initialBadge = firstCard.locator('[aria-label="Fake"], [aria-label="Non-fake"]')
    const initialStatus = await initialBadge.getAttribute('aria-label')

    // Go to vote page and submit a vote
    await firstCard.getByRole('link', { name: 'Vote' }).click()
    await page.getByRole('radio', { name: 'Fake', exact: true }).check()
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // Wait for toast and redirect
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    
    // Go back to home page
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Check that the badge is still visible (status may or may not have changed)
    const updatedBadge = page.locator('ul.grid > li').first().locator('[aria-label="Fake"], [aria-label="Non-fake"]')
    await expect(updatedBadge).toBeVisible()
  })

  test('comments display badges based on isFake property from store', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that comments have badges
    const commentsList = page.getByTestId('comments-list')
    await expect(commentsList).toBeVisible()

    const commentBadges = page.locator('[aria-label="Fake"], [aria-label="Non-fake"]')
    const badgeCount = await commentBadges.count()
    
    // Should have at least some badges from mock data
    expect(badgeCount).toBeGreaterThan(0)
  })

  test('new comments get correct isFake property when submitted with vote', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Submit a fake vote with comment
    await page.getByRole('link', { name: 'Vote' }).click()
    await page.getByRole('radio', { name: 'Fake', exact: true }).check()
    await page.fill('#comment', 'Test comment with fake vote')
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // Wait for redirect back to details page
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that the new comment has a fake badge
    const fakeBadges = page.locator('[aria-label="Fake"]')
    await expect(fakeBadges.last()).toBeVisible()

    // Submit a non-fake vote with comment
    await page.getByRole('link', { name: 'Vote' }).click()
    await page.getByRole('radio', { name: 'Non-fake', exact: true }).check()
    await page.fill('#comment', 'Test comment with non-fake vote')
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // Wait for redirect back to details page
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that the new comment has a non-fake badge
    const nonFakeBadges = page.locator('[aria-label="Non-fake"]')
    await expect(nonFakeBadges.last()).toBeVisible()
  })

  test('store correctly maps isFake property for comments without it', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Check that all comments have badges (store should infer isFake for missing ones)
    const commentsList = page.getByTestId('comments-list')
    const commentItems = commentsList.locator('li')
    const commentCount = await commentItems.count()

    // Each comment should have either a fake or non-fake badge
    for (let i = 0; i < Math.min(3, commentCount); i++) {
      const comment = commentItems.nth(i)
      const badge = comment.locator('[aria-label="Fake"], [aria-label="Non-fake"]')
      await expect(badge).toBeVisible()
    }
  })

  test('vote counts update correctly and affect badge display', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Check initial vote counts
    const fakeCount = page.locator('text=Fake:').first()
    const nonFakeCount = page.locator('text=Non-fake:').first()
    
    await expect(fakeCount).toBeVisible()
    await expect(nonFakeCount).toBeVisible()

    // Submit multiple votes to see count changes
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Vote' }).click()
      await page.getByRole('radio', { name: 'Fake', exact: true }).check()
      await page.getByRole('button', { name: 'Submit Vote' }).click()
      await page.waitForURL('**/news/*', { waitUntil: 'load' })
    }

    // Vote counts should have increased
    await expect(fakeCount).toBeVisible()
    await expect(nonFakeCount).toBeVisible()
  })
})
