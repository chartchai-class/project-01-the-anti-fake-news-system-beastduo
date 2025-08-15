<template>
  <!-- This component doesn't render anything visible -->
</template>

<script>
export default {
  name: 'AnalyticsTracker',
  props: {
    eventName: {
      type: String,
      required: true
    },
    eventData: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.trackEvent()
  },
  methods: {
    trackEvent() {
      // Simulate analytics tracking
      console.log(`[Analytics] ${this.eventName}:`, this.eventData)
      
      // In a real app, this would send data to analytics service
      // For now, just store in localStorage for demo purposes
      const analytics = JSON.parse(localStorage.getItem('analytics') || '[]')
      analytics.push({
        event: this.eventName,
        data: this.eventData,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('analytics', JSON.stringify(analytics))
    }
  }
}
</script>
