import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Navigation navbar functionality', () => {
  test('NewsDetailsPage has working navigation tabs', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()

    // Check that navigation tabs are present
    const detailsTab = page.getByRole('link', { name: 'Details' })
    const voteTab = page.getByRole('link', { name: 'Vote' })
    
    await expect(detailsTab).toBeVisible()
    await expect(voteTab).toBeVisible()

    // Details tab should be active (current page)
    await expect(detailsTab).toHaveClass(/ring-2/)
    await expect(detailsTab).toHaveClass(/ring-blue-400/)

    // Click Vote tab to navigate to vote page
    await voteTab.click()
    await expect(page).toHaveURL(/\/news\/.*\/vote/)
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
  })

  test('VotePage has working navigation tabs', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go directly to vote page via vote button
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'Vote' }).click()

    // Wait for vote page to load
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()

    // Check that navigation tabs are present
    const detailsTab = page.getByRole('link', { name: 'Details' })
    const voteTab = page.getByRole('link', { name: 'Vote' })
    
    await expect(detailsTab).toBeVisible()
    await expect(voteTab).toBeVisible()

    // Vote tab should be active (current page)
    await expect(voteTab).toHaveClass(/ring-2/)
    await expect(voteTab).toHaveClass(/ring-green-400/)

    // Click Details tab to navigate to details page
    await detailsTab.click()
    await expect(page).toHaveURL(/\/news\/.*$/)
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
  })

  test('navigation tabs have correct styling and hover effects', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to details page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    const detailsTab = page.getByRole('link', { name: 'Details' })
    const voteTab = page.getByRole('link', { name: 'Vote' })

    // Check Details tab styling
    await expect(detailsTab).toHaveClass(/text-blue-700/)
    await expect(detailsTab).toHaveClass(/bg-blue-100/)
    await expect(detailsTab).toHaveClass(/font-bold/)

    // Check Vote tab styling
    await expect(voteTab).toHaveClass(/text-green-700/)
    await expect(voteTab).toHaveClass(/bg-green-100/)
    await expect(voteTab).toHaveClass(/font-bold/)

    // Test hover effects
    await voteTab.hover()
    await expect(voteTab).toHaveClass(/hover:bg-green-200/)
  })

  test('navigation tabs work correctly with different news items', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Test with first news item
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()
    
    const firstNewsId = page.url().split('/').pop()
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()

    // Navigate to vote page
    await page.getByRole('link', { name: 'Vote' }).click()
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`/news/${firstNewsId}/vote`))

    // Go back to home and test with second news item
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    const secondCard = page.locator('ul.grid > li').nth(1)
    await secondCard.getByRole('link', { name: 'Vote' }).click()
    
    await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()

    // Navigate to details page
    await page.getByRole('link', { name: 'Details' }).click()
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    await expect(page).toHaveURL(/\/news\/.*$/)
  })

  test('navigation tabs maintain state during page interactions', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Go to details page
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    // Navigate between tabs multiple times
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Vote' }).click()
      await expect(page.getByRole('heading', { name: 'Vote' })).toBeVisible()
      
      await page.getByRole('link', { name: 'Details' }).click()
      await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
    }
  })
})
