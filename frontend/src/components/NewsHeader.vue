<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
    <div>
      <h2 class="text-xl font-bold text-[#002b5c]">{{ headline }}</h2>
      <div class="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
        <span>Reporter: <strong class="text-[#002b5c]">{{ reporter }}</strong></span>
        <span>Reported: {{ formatDate(reportedAt) }}</span>
      </div>
    </div>
    <span
      :class="[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-2',
        isFake
          ? 'bg-[#e10600]/10 text-[#e10600] ring-[#e10600]'
          : 'bg-[#002b5c]/10 text-[#002b5c] ring-[#002b5c]'
      ]"
      :aria-label="isFake ? 'Fake' : 'Non-fake'"
    >{{ isFake ? 'Fake' : 'Non‑fake' }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  headline: String,
  reporter: String,
  reportedAt: String,
  isFake: Boolean,
  formatDate: Function
})
</script>
