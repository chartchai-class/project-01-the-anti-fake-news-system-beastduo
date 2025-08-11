import { test, expect } from '@playwright/test'

const routes = {
  home: '/',
}

test.describe('Responsive layout', () => {
  test('header and nav adapt across breakpoints', async ({ page }) => {
    await page.goto(routes.home)

    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 })
    // Disambiguate the 'Home' link in the nav list
    const nav = page.locator('header nav')
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
    // Brand link uses aria-label which overrides text content
    await expect(page.getByRole('link', { name: 'Go to Home' })).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 820, height: 900 })
    await expect(page.locator('header nav').getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()

    // Mobile: content should still be accessible
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('link', { name: 'Go to Home' })).toBeVisible()
  })

  test('list grid collapses to single column on small screens', async ({ page }) => {
    await page.goto(routes.home)

    // Ensure data is hydrated (loading indicator disappears)
    await expect(page.getByText('Loading data...')).toBeHidden({ timeout: 5000 })

    // At desktop width, cards are arranged in 2 columns (sm:grid-cols-2)
    await page.setViewportSize({ width: 1200, height: 800 })
    const itemsDesktop = page.locator('ul.grid > li')
    await expect(itemsDesktop.first()).toBeVisible()
    const firstBox = await itemsDesktop.first().boundingBox()
    const secondBox = await itemsDesktop.nth(1).boundingBox()
    // second item should be in the same row or to the right when wide
    expect(secondBox.x).toBeGreaterThan(firstBox.x)

    // On mobile width, layout should stack vertically
    await page.setViewportSize({ width: 375, height: 900 })
    const firstBoxMobile = await itemsDesktop.first().boundingBox()
    const secondBoxMobile = await itemsDesktop.nth(1).boundingBox()
    expect(secondBoxMobile.y).toBeGreaterThan(firstBoxMobile.y)
  })

  test('controls remain usable on mobile', async ({ page }) => {
    await page.goto(routes.home)
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByLabel('Filter')).toBeVisible()
    await expect(page.getByLabel('Select page size')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next page' })).toBeVisible()
  })
})

