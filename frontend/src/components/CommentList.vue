<template>
  <div class="mt-6" data-testid="comments-section">
    <h3 class="text-lg font-bold text-[#002b5c] mb-2">Comments</h3>
    <div v-if="comments.length === 0" class="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500 bg-gray-50">
      No comments yet.
    </div>
    <ul v-else class="space-y-4" data-testid="comments-list">
      <li v-for="c in pagedComments" :key="c.id" class="rounded border bg-gray-50 p-3 shadow-sm">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-bold text-[#002b5c]">{{ c.author || 'Anonymous' }}</span>
          <span class="text-xs text-gray-400">{{ formatDate(c.createdAt) }}</span>
        </div>
        <p class="text-sm text-gray-700">{{ c.text }}</p>
        <div v-if="c.imageUrl" class="mt-2">
          <img :src="c.imageUrl" alt="Comment image" class="w-full h-auto rounded border" loading="lazy" />
        </div>
      </li>
    </ul>
    <nav v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2" data-testid="comments-pager">
      <button @click="goPage(page-1)" :disabled="page <= 1" aria-label="Prev comments page" class="rounded px-2 py-1 text-sm font-bold border border-[#002b5c] text-[#002b5c] bg-white disabled:opacity-50">Prev</button>
      <span class="text-sm font-bold text-[#002b5c]" data-testid="comments-page-label">Page {{ page }} of {{ totalPages }}</span>
      <button @click="goPage(page+1)" :disabled="page >= totalPages" aria-label="Next comments page" class="rounded px-2 py-1 text-sm font-bold border border-[#e10600] text-[#e10600] bg-white disabled:opacity-50">Next</button>
    </nav>
  </div>
</template>
<script setup>
const props = defineProps({
  comments: Array,
  pagedComments: Array,
  page: Number,
  totalPages: Number,
  goPage: Function,
  formatDate: Function
})
</script>
