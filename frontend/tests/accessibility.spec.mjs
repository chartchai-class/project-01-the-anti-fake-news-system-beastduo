import { test, expect } from '@playwright/test'

test.describe('Accessibility Features', () => {
  test('keyboard navigation works for news cards', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    // Test tab navigation through cards
    await page.keyboard.press('Tab')
    const firstCard = page.locator('ul.grid > li').first()
    await expect(firstCard).toBeFocused()
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight')
    const secondCard = page.locator('ul.grid > li').nth(1)
    await expect(secondCard).toBeFocused()
  })

  test('search bar is accessible with keyboard', async ({ page }) => {
    await page.goto('/')
    
    // Find search input and focus it
    const searchInput = page.getByPlaceholder('Search news...')
    await searchInput.focus()
    await expect(searchInput).toBeFocused()
    
    // Type and submit with Enter
    await searchInput.fill('test')
    await page.keyboard.press('Enter')
    
    // Verify search was performed
    await expect(page.locator('ul.grid')).toBeVisible()
  })

  test('vote form is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    // Navigate to first card and open details
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()
    
    // Navigate to vote page
    await page.getByRole('link', { name: 'Vote' }).click()
    
    // Test keyboard navigation in vote form
    await page.keyboard.press('Tab')
    const fakeRadio = page.getByRole('radio', { name: 'Fake', exact: true })
    await expect(fakeRadio).toBeFocused()
    
    // Select with spacebar
    await page.keyboard.press(' ')
    await expect(fakeRadio).toBeChecked()
  })

  test('pagination is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('ul.grid > li', { state: 'visible' })
    
    // Find pagination and test keyboard navigation
    const nextButton = page.getByRole('button', { name: 'Next' })
    if (await nextButton.isVisible()) {
      await nextButton.focus()
      await expect(nextButton).toBeFocused()
      
      // Test Enter key activation
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/page=2/)
    }
  })
})
