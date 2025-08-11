<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const newsId = computed(() => String(route.params.id || ''))

function goToDetails() {
  router.push({ name: 'news-details', params: { id: newsId.value } })
}
</script>

<template>
  <main class="min-h-screen">
    <div class="flex items-center gap-3 mb-6">
      <button class="text-sm text-blue-600 hover:underline" @click="goToDetails">← Back to details</button>
      <h1 class="text-2xl font-semibold">Vote</h1>
    </div>
    <div class="rounded border bg-white p-4 shadow-sm">
      <p class="text-gray-600">Vote page for:</p>
      <p class="mt-1 text-lg font-mono">{{ newsId }}</p>
      <p class="mt-4 text-gray-500">Form coming soon.</p>
    </div>
  </main>
  
</template>


