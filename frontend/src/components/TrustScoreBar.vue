<template>
  <div class="w-full flex items-center gap-2">
    <div class="flex-1 h-2 bg-gray-200 rounded">
      <div
        class="h-2 rounded transition-all duration-300"
        :class="scoreColor"
        :style="{ width: score + '%' }"
      ></div>
    </div>
  <span class="text-xs font-bold ml-2" :class="scoreTextColor">{{ score }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  score: Number // 0-100
})
const scoreColor = computed(() => {
  if (props.score >= 70) return 'bg-green-600 text-green-700'
  if (props.score >= 40) return 'bg-yellow-400 text-yellow-700'
  return 'bg-[#E30613] text-white'
})
const scoreTextColor = computed(() => {
  if (props.score >= 70) return 'text-green-700'
  return 'text-yellow-700'
})
</script>

<style scoped>
</style>
