<template>
  <nav class="mt-8 flex items-center justify-between gap-4">
    <button type="button" @click="$emit('prev')"
            class="rounded bg-white border-2 border-[#002b5c] px-4 py-2 text-base font-bold text-[#002b5c] shadow hover:bg-[#002b5c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e10600] disabled:cursor-not-allowed disabled:opacity-50 transition"
            :disabled="currentPage <= 1"
            aria-label="Previous page">
      Prev
    </button>
    <div class="text-base font-bold text-[#002b5c]">Page {{ currentPage }} of {{ totalPages }}</div>
    <button type="button" @click="$emit('next')"
            class="rounded bg-white border-2 border-[#e10600] px-4 py-2 text-base font-bold text-[#e10600] shadow hover:bg-[#e10600] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#002b5c] disabled:cursor-not-allowed disabled:opacity-50 transition"
            :disabled="currentPage >= totalPages"
            aria-label="Next page">
      Next
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
</script>
