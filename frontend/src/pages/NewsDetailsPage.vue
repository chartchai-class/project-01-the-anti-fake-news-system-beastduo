<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const newsId = computed(() => String(route.params.id || ''))

function goBack() {
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="min-h-screen">
    <div class="flex items-center gap-3 mb-6">
      <button class="text-sm text-blue-600 hover:underline" @click="goBack">← Back</button>
      <h1 class="text-2xl font-semibold">News Details</h1>
    </div>
    <div class="rounded border bg-white p-4 shadow-sm">
      <p class="text-gray-600">Details page for:</p>
      <p class="mt-1 text-lg font-mono">{{ newsId }}</p>
      <p class="mt-4 text-gray-500">Content coming soon.</p>
    </div>
  </main>
  
</template>


