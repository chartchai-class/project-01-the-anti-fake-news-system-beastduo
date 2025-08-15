import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('home page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('news details page loads quickly', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    const startTime = Date.now()
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()
    await page.waitForSelector('[aria-label="Fake"], [aria-label="Non-fake"]', { state: 'visible' })
    const loadTime = Date.now() - startTime
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000)
  })

  test('search functionality responds quickly', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    const searchInput = page.getByPlaceholder('Search news...')
    await searchInput.fill('test')
    
    const startTime = Date.now()
    await page.keyboard.press('Enter')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    const searchTime = Date.now() - startTime
    
    // Search should complete within 1 second
    expect(searchTime).toBeLessThan(1000)
  })

  test('pagination loads quickly', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    const nextButton = page.getByRole('button', { name: 'Next' })
    if (await nextButton.isVisible()) {
      const startTime = Date.now()
      await nextButton.click()
      await page.waitForSelector('ul.grid > li', { state: 'visible' })
      const paginationTime = Date.now() - startTime
      
      // Pagination should load within 1.5 seconds
      expect(paginationTime).toBeLessThan(1500)
    }
  })

  test('vote submission is responsive', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()
    await page.getByRole('link', { name: 'Vote' }).click()
    
    const startTime = Date.now()
    await page.getByRole('radio', { name: 'Fake', exact: true }).check()
    await page.getByRole('button', { name: 'Submit Vote' }).click()
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    const voteTime = Date.now() - startTime
    
    // Vote submission should complete within 2 seconds
    expect(voteTime).toBeLessThan(2000)
  })
})
