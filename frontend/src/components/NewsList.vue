<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="news in newsList"
      :key="news.id"
      class="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border-l-8 transition-transform duration-150 hover:scale-[1.015] hover:shadow-xl hover:bg-blue-50 cursor-pointer"
      :class="news.isFake ? 'border-[#E30613]' : 'border-green-600'"
      @click="$emit('select', news.id)"
    >
      <img :src="news.imageUrl" alt="news image" class="w-full sm:w-40 h-28 object-cover rounded-md" />
      <div class="flex-1 flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="text-lg font-extrabold text-[#005BAC]">{{ news.title }}</span>
          <span
            class="ml-2 px-2 py-0.5 rounded-full font-bold text-xs"
            :class="news.isFake ? 'bg-[#E30613] text-white' : 'bg-green-600 text-white'"
          >
            {{ news.isFake ? 'Fake' : 'Not Fake' }}
          </span>
        </div>
        <div class="text-gray-700 text-sm font-semibold">{{ news.summary }}</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-gray-500 font-bold">By {{ news.reporterName }}</span>
          <span class="text-xs text-gray-400">• {{ formatDate(news.reportedAt) }}</span>
        </div>
        <div class="flex items-center gap-4 mt-2">
          <span class="text-xs font-bold text-[#E30613]">Fake Votes: {{ news.fakeVotes }}</span>
          <span class="text-xs font-bold text-green-600">Not Fake Votes: {{ news.notFakeVotes }}</span>
          <TrustScoreBar :score="news.trustScore" />
        </div>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <svg class="animate-spin h-8 w-8 text-[#005BAC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
    <div v-if="!loading && newsList.length === 0" class="text-center text-gray-500 font-bold py-8">No news found.</div>
  </div>
</template>

<script setup>
import TrustScoreBar from './TrustScoreBar.vue'
const props = defineProps({
  newsList: Array,
  loading: Boolean
})
const emit = defineEmits(['select'])
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString()
}
</script>

<style scoped>
</style>
