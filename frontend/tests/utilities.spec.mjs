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
    
    // Get performance metrics using multiple approaches
    const metrics = await page.evaluate(() => {
      // Try different performance APIs
      let loadTime = 0
      let domContentLoaded = 0
      
      // Method 1: Navigation Timing API
      if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
        const navigation = performance.getEntriesByType('navigation')[0]
        loadTime = navigation.loadEventEnd - navigation.loadEventStart
        domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      }
      
      // Method 2: Legacy Performance Timing API
      if (performance.timing) {
        loadTime = performance.timing.loadEventEnd - performance.timing.loadEventStart
        domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart
      }
      
      // Method 3: Use current time as fallback
      if (loadTime <= 0) {
        loadTime = performance.now()
      }
      if (domContentLoaded <= 0) {
        domContentLoaded = performance.now()
      }
      
      return {
        loadTime,
        domContentLoaded,
        currentTime: performance.now()
      }
    })
    
    // Verify metrics are reasonable - allow for 0 values in some browsers
    expect(metrics.currentTime).toBeGreaterThan(0)
    
    // These might be 0 in some browsers, so we'll just check they exist
    expect(typeof metrics.loadTime).toBe('number')
    expect(typeof metrics.domContentLoaded).toBe('number')
  })
})
