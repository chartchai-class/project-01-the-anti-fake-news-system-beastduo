<script setup>
import { onMounted } from 'vue'
import { useNewsStore } from './stores/news'

const newsStore = useNewsStore()

onMounted(() => {
  newsStore.loadSeeds()
  newsStore.hydrateFromLocalStorage()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="!newsStore.hydrated" class="py-20 text-center text-gray-500">
      Loading data...
    </div>
    <router-view v-else />
  </div>
  
</template>

