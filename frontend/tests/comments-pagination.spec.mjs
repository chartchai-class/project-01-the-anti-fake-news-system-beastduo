import { test, expect } from '@playwright/test'

const routes = { home: '/' }

test.describe('Comments pagination on details page', () => {
  test('navigating pages updates the visible comments', async ({ page }) => {
    await page.goto(routes.home)
    await page.waitForSelector('ul.grid > li', { state: 'visible' })

    // Open details of the first card
    const firstCard = page.locator('ul.grid > li').first()
    await firstCard.getByRole('link', { name: 'View details' }).click()

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()

    // Seed at least 6 comments through the Vote flow so pagination is guaranteed (page size = 5)
    for (let i = 0; i < 6; i++) {
      await page.getByRole('link', { name: 'Vote' }).click()
      await page.getByRole('radio', { name: 'Fake', exact: true }).check()
      await page.fill('#comment', `E2E seeded comment ${i}`)
      await page.getByRole('button', { name: 'Submit Vote' }).click()
      await page.waitForURL('**/news/*', { waitUntil: 'load' })
      await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible()
    }

    const pager = page.getByTestId('comments-pager')
    const pageLabel = page.getByTestId('comments-page-label')
    const list = page.getByTestId('comments-list')

    await expect(pager).toBeVisible()

    const firstComment = list.locator('li').first()
    await expect(firstComment).toBeVisible()
    const firstBefore = await firstComment.textContent()

    // Navigate to next page and expect label to change and list to update
    await page.getByRole('button', { name: 'Next comments page' }).click()
    await expect(pageLabel).toContainText('Page 2 of')

    // Wait for the list to rerender with different first item
    await expect(firstComment).not.toHaveText(firstBefore || '')
  })
})


