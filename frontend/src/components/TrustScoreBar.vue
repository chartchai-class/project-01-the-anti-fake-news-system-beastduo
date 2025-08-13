<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <span class="text-xs text-[#e10600] font-bold">Fake {{ fakePercent }}%</span>
      <span class="flex-1 h-3 rounded bg-gray-200 overflow-hidden relative">
        <span :style="{ width: fakePercent + '%'}" class="absolute left-0 top-0 h-full bg-[#e10600] transition-all"></span>
        <span :style="{ width: notFakePercent + '%', left: fakePercent + '%' }" class="absolute top-0 h-full bg-[#038619] transition-all"></span>
      </span>
      <span class="text-xs text-[#038619] font-bold">Not Fake {{ notFakePercent }}%</span>
    </div>
    <div class="flex justify-between text-[11px] text-gray-500">
      <span>Fake: {{ fakeVotes || 0 }}</span>
      <span>Not Fake: {{ notFakeVotes || 0 }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  fakeVotes: { type: Number, required: true },
  notFakeVotes: { type: Number, required: true }
})
const fakePercent = computed(() => {
  const total = (props.fakeVotes || 0) + (props.notFakeVotes || 0)
  return total === 0 ? 0 : Math.round((props.fakeVotes / total) * 100)
})
const notFakePercent = computed(() => {
  const total = (props.fakeVotes || 0) + (props.notFakeVotes || 0)
  return total === 0 ? 0 : Math.round((props.notFakeVotes / total) * 100)
})
</script>
