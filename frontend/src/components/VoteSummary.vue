<template>
  <div class="mb-4 flex flex-wrap items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="rounded-full bg-[#e10600]/10 px-2 py-0.5 text-xs font-bold text-[#e10600]">Fake: {{ fakeCount }}</span>
      <span class="rounded-full bg-[#002b5c]/10 px-2 py-0.5 text-xs font-bold text-[#002b5c]">Non-fake: {{ nonFakeCount }}</span>
    </div>
    <button @click="onVote" class="ml-auto rounded bg-[#e10600] px-4 py-2 text-white font-bold shadow hover:bg-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#002b5c] transition">Vote on this news</button>
  </div>
</template>
<script setup>
const props = defineProps({
  fakeCount: Number,
  nonFakeCount: Number,
  onVote: Function
})
</script>
