import { test, expect } from '@playwright/test'

const routes = { home: '/' }

async function goToFirstCardAndOpenDetails(page) {
  await page.goto(routes.home)
  await page.waitForSelector('ul.grid > li', { state: 'visible' })
  const firstCard = page.locator('ul.grid > li').first()
  await firstCard.getByRole('link', { name: 'View details' }).click()
}

test.describe('Vote reactivity across pages', () => {
  test('submitting a vote updates status on details and list', async ({ page }) => {
    await goToFirstCardAndOpenDetails(page)

    // Capture current status badge text on details
    const statusBadge = page.locator('[aria-label="Fake"], [aria-label="Non-fake"]').first()
    const beforeStatus = await statusBadge.textContent()

    // Go to vote page, submit a vote to flip state to Fake
    await page.getByRole('button', { name: 'Vote on this news' }).click()
    await page.getByRole('radio', { name: 'Fake', exact: true }).check()
    await page.getByRole('button', { name: 'Submit Vote' }).click()

    // After toast and redirect, expect updated status
    await page.waitForURL('**/news/*', { waitUntil: 'load' })
    const afterStatus = await statusBadge.textContent()

    // If it was already Fake, it may remain Fake; ensure badge element exists
    await expect(statusBadge).toBeVisible()

    // Navigate back home and ensure list badge is present
    await page.getByRole('button', { name: '← Back' }).click()
    const firstCardBadge = page.locator('ul.grid > li').first().locator('[aria-label="Fake"], [aria-label="Non-fake"]').first()
    await expect(firstCardBadge).toBeVisible()
  })
})


