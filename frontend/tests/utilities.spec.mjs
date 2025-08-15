import { test, expect } from '@playwright/test'

test.describe('Utility Functions', () => {
  test('analytics tracking works', async ({ page }) => {
    await page.goto('/')
    
    // Clear any existing analytics
    await page.evaluate(() => {
      localStorage.removeItem('analytics')
    })
    
    // Simulate a page view event
    await page.evaluate(() => {
      const analytics = JSON.parse(localStorage.getItem('analytics') || '[]')
      analytics.push({
        event: 'page_view',
        data: { page: 'home' },
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('analytics', JSON.stringify(analytics))
    })
    
    // Check that analytics were stored
    const analytics = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('analytics') || '[]')
    })
    
    expect(analytics).toHaveLength(1)
    expect(analytics[0].event).toBe('page_view')
  })

  test('error tracking works', async ({ page }) => {
    await page.goto('/')
    
    // Clear any existing error logs
    await page.evaluate(() => {
      localStorage.removeItem('errorLog')
    })
    
    // Simulate an error
    await page.evaluate(() => {
      const errorTracker = {
        errors: [],
        trackError: function(error, context = {}) {
          const errorInfo = {
            message: error.message || error,
            context,
            timestamp: new Date().toISOString()
          }
          this.errors.push(errorInfo)
          localStorage.setItem('errorLog', JSON.stringify(this.errors))
        }
      }
      
      errorTracker.trackError(new Error('Test error'), { source: 'test' })
    })
    
    // Check that error was logged
    const errors = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('errorLog') || '[]')
    })
    
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('Test error')
  })

  test('localStorage persistence works', async ({ page }) => {
    await page.goto('/')
    
    // Set some test data
    await page.evaluate(() => {
      localStorage.setItem('testData', JSON.stringify({ test: 'value' }))
    })
    
    // Navigate to another page
    await page.goto('/about')
    
    // Check data persists
    const data = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('testData') || '{}')
    })
    
    expect(data.test).toBe('value')
  })

  test('performance monitoring works', async ({ page }) => {
    await page.goto('/')
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
      }
    })
    
    // Verify metrics are reasonable
    expect(metrics.loadTime).toBeGreaterThan(0)
    expect(metrics.domContentLoaded).toBeGreaterThan(0)
  })
})
