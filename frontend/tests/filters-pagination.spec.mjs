import { test, expect } from '@playwright/test'

const routes = { home: '/' }

async function waitForListHydrated(page) {
  // Wait for at least one list item to render
  await page.waitForSelector('ul.grid > li', { state: 'visible' })
}

test.describe('Filters and pagination integration', () => {
  test('filter changes reset page to 1 and combine with page size', async ({ page }) => {
    await page.goto(routes.home)
    await waitForListHydrated(page)

    const showing = page.locator('text=/^Showing /')

    // Start with size 5 for predictable math
    await page.getByLabel('Select page size').selectOption('5')
    await expect(showing).toContainText('Showing 1 - 5 of')

    // Go to next page (if available)
    const nextBtn = page.getByRole('button', { name: 'Next page' })
    if (await nextBtn.isEnabled()) {
      await nextBtn.click()
      await expect(showing).toContainText('Showing 6 - 10')
    }

    // Apply filter: Fake
    await page.getByLabel('Filter').selectOption('fake')
    // Page should reset back to 1
    await expect(showing).toContainText('Showing 1 -')

    // Record total after filter from the "Showing" text
    const showingText = await showing.textContent()
    // e.g., "Showing 1 - 5 of 23" → extract total 23
    const totalMatch = showingText && showingText.match(/of\s+(\d+)$/)
    expect(totalMatch, 'Showing text should contain total count').not.toBeNull()

    // Change page size to 10; page should remain/reset to 1
    await page.getByLabel('Select page size').selectOption('10')
    await expect(showing).toContainText('Showing 1 - 10')
  })
})


