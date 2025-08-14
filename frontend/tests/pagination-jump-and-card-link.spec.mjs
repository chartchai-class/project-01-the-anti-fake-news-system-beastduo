import { test, expect } from '@playwright/test'

const routes = { home: '/' }

async function waitForListHydrated(page) {
  await page.waitForSelector('ul.grid > li', { state: 'visible' })
}

test.describe('Numbered pagination jump and card router-links', () => {
  test('jumping directly to a page via number scrolls to top and updates range', async ({ page }) => {
    await page.goto(routes.home)
    await waitForListHydrated(page)

    // Ensure small page size to create many pages (so ellipsis renders)
    await page.getByLabel('Select page size').selectOption('5')

    // Scroll down to simulate user being away from top
    await page.evaluate(() => window.scrollTo(0, 1500))
    const beforeY = await page.evaluate(() => window.scrollY)
    expect(beforeY).toBeGreaterThan(200)

    // Click page number 3
    const pageThreeBtn = page.getByRole('button', { name: /^3$/ })
    await pageThreeBtn.click()

    // After internal loading delay and scroll-to-top
    await page.waitForTimeout(700)
    const afterY = await page.evaluate(() => Math.round(window.scrollY))
    expect(afterY).toBeLessThanOrEqual(5)

    // Verify the showing range updates for page 3 with size 5 → 11 - 15
    await expect(page.locator('text=/^Showing /')).toContainText('11 - 15')

    // Ellipsis should be visible since total pages > 7
    const ellipsis = page.locator('nav ul li span', { hasText: '…' })
    await expect(ellipsis.first()).toBeVisible()
  })

  test('clicking within the NewsCard title navigates to details via router-link', async ({ page }) => {
    await page.goto(routes.home)
    await waitForListHydrated(page)

    const firstCard = page.locator('ul.grid > li').first()
    const titleEl = firstCard.locator('h2')
    await expect(titleEl).toBeVisible()

    // Capture title for sanity
    const titleText = (await titleEl.textContent())?.trim()
    expect(titleText && titleText.length).toBeGreaterThan(0)

    // Clicking the title (inside router-link wrapper) should navigate to /news/:id
    await titleEl.click()
    await expect(page).toHaveURL(/\/news\//)
    await expect(page.getByRole('heading', { name: 'News Details' })).toBeVisible()
  })

  test('card Vote link navigates to vote page and scrolls to top on mount', async ({ page }) => {
    await page.goto(routes.home)
    await waitForListHydrated(page)

    const firstCard = page.locator('ul.grid > li').first()

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 1600))
    const beforeY = await page.evaluate(() => window.scrollY)
    expect(beforeY).toBeGreaterThan(200)

    await firstCard.getByRole('link', { name: 'Vote' }).click()
    await expect(page).toHaveURL(/\/vote$/)

    // onMounted in VotePage should call scrollTo top
    await page.waitForTimeout(600)
    const afterY = await page.evaluate(() => Math.round(window.scrollY))
    expect(afterY).toBeLessThanOrEqual(5)

    await expect(page.getByRole('heading', { name: 'Vote', exact: true })).toBeVisible()
  })
})


