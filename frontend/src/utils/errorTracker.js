class ErrorTracker {
  constructor() {
    this.errors = []
    this.maxErrors = 100
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

export default errorTracker
