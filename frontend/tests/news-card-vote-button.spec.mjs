import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('NewsCard vote button functionality', () => {
  test('vote button is visible and navigates to vote page', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Get the first news card
    const firstCard = page.locator('ul.grid > li').first()
    
    // Check that both View details and Vote buttons are present
    const viewDetailsButton = firstCard.getByRole('link', { name: 'View details' })
    const voteButton = firstCard.getByRole('link', { name: 'Vote' })
    
    await expect(viewDetailsButton).toBeVisible()
    await expect(voteButton).toBeVisible()

    // Click the vote button
    await voteButton.click()

    // Should navigate to vote page
    await expect(page).toHaveURL(/\/news\/.*\/vote/)
    await expect(page.getByRole('heading', { name: 'Vote', exact: true })).toBeVisible()
  })

  test('vote button has correct styling and hover effects', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    const firstCard = page.locator('ul.grid > li').first()
    const voteButton = firstCard.getByRole('link', { name: 'Vote' })
    
    // Check initial styling
    await expect(voteButton).toHaveClass(/bg-\[#e10600\]/)
    await expect(voteButton).toHaveClass(/text-white/)
    await expect(voteButton).toHaveClass(/font-bold/)

    // Check hover effect (simulate hover)
    await voteButton.hover()
    // The button should have hover transition classes
    await expect(voteButton).toHaveClass(/transition/)
  })

  test('vote button is positioned correctly relative to view details button', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    const firstCard = page.locator('ul.grid > li').first()
    
    // Both buttons should be in the same container
    const buttonContainer = firstCard.locator('.flex.items-center.gap-3')
    await expect(buttonContainer).toBeVisible()
    
    const viewDetailsButton = buttonContainer.getByRole('link', { name: 'View details' })
    const voteButton = buttonContainer.getByRole('link', { name: 'Vote' })
    
    await expect(viewDetailsButton).toBeVisible()
    await expect(voteButton).toBeVisible()
  })

  test('vote button works for all news cards on the page', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Get all news cards
    const newsCards = page.locator('ul.grid > li')
    const cardCount = await newsCards.count()

    // Test vote button on first few cards
    for (let i = 0; i < Math.min(3, cardCount); i++) {
      const card = newsCards.nth(i)
      const voteButton = card.getByRole('link', { name: 'Vote' })
      
      await expect(voteButton).toBeVisible()
      
      // Click vote button
      await voteButton.click()
      
      // Should be on vote page
      await expect(page.getByRole('heading', { name: 'Vote', exact: true })).toBeVisible()
      
      // Go back to home page
      await page.goto(routes.home)
      await page.waitForSelector('ul.grid > li', { state: 'visible' })
    }
  })

  test('vote button maintains functionality after page interactions', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    const firstCard = page.locator('ul.grid > li').first()
    const voteButton = firstCard.getByRole('link', { name: 'Vote' })

    // First interaction - click vote button
    await voteButton.click()
    await expect(page.getByRole('heading', { name: 'Vote', exact: true })).toBeVisible()
    
    // Go back to home
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Second interaction - should still work
    const voteButtonAgain = page.locator('ul.grid > li').first().getByRole('link', { name: 'Vote' })
    await voteButtonAgain.click()
    await expect(page.getByRole('heading', { name: 'Vote', exact: true })).toBeVisible()
  })
})
