class ErrorTracker {
  constructor() {
    this.errors = []
    this.maxErrors = 100
    this.performanceMetrics = {}
  }

  trackError(error, context = {}) {
    const errorInfo = {
      message: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.errors.push(errorInfo)
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Store in localStorage
    localStorage.setItem('errorLog', JSON.stringify(this.errors))
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracker]', errorInfo)
    }
  }

  // Performance monitoring methods
  startPerformanceTimer(name) {
    if (!this.performanceMetrics[name]) {
      this.performanceMetrics[name] = {
        startTime: performance.now(),
        loadTime: 0,
        domContentLoaded: 0
      }
    }
  }

  endPerformanceTimer(name) {
    if (this.performanceMetrics[name]) {
      const endTime = performance.now()
      this.performanceMetrics[name].loadTime = endTime - this.performanceMetrics[name].startTime
      
      // Get DOM content loaded time
      if (document.readyState === 'complete') {
        this.performanceMetrics[name].domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      }
    }
  }

  getPerformanceMetrics(name) {
    return this.performanceMetrics[name] || { loadTime: 0, domContentLoaded: 0 }
  }

  trackPageLoad() {
    this.startPerformanceTimer('pageLoad')
    
    if (document.readyState === 'complete') {
      this.endPerformanceTimer('pageLoad')
    } else {
      window.addEventListener('load', () => {
        this.endPerformanceTimer('pageLoad')
      })
    }
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    localStorage.removeItem('errorLog')
  }

  getErrorCount() {
    return this.errors.length
  }

  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit)
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker()

// Global error handler
window.addEventListener('error', (event) => {
  errorTracker.trackError(event.error || event.message, {
    type: 'unhandled',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
})

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  errorTracker.trackError(event.reason, {
    type: 'unhandledrejection'
  })
})

// Start performance tracking on page load
errorTracker.trackPageLoad()

export default errorTracker
