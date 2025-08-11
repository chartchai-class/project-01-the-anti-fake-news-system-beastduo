<script setup>
import { computed, watch } from 'vue'
import { useNewsStore } from '../stores/news'

const newsStore = useNewsStore()

const totalPages = computed(() => {
  const total = newsStore.filteredNews.length
  const perPage = newsStore.listPageSize || 1
  return Math.max(1, Math.ceil(total / perPage))
})

watch(
  () => [newsStore.listPage, totalPages.value],
  () => {
    if (newsStore.listPage > totalPages.value) {
      newsStore.setPage(totalPages.value)
    }
  },
  { immediate: true }
)

function onChangeFilter(event) {
  newsStore.setFilter(event.target.value)
}

function onChangePageSize(event) {
  newsStore.setPageSize(Number(event.target.value))
}

function goPrev() {
  if (newsStore.listPage > 1) newsStore.setPage(newsStore.listPage - 1)
}

function goNext() {
  if (newsStore.listPage < totalPages.value) newsStore.setPage(newsStore.listPage + 1)
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit'
    })
  } catch {
    return iso
  }
}

function truncate(text, max = 140) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}
</script>

<template>
  <section class="py-6">
    <header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Anti‑Fake News</h1>
        <p class="text-sm text-gray-600">Community voting to flag misinformation.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm font-medium text-gray-700">Filter</label>
        <select class="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                :value="newsStore.listFilter" @change="onChangeFilter">
          <option value="all">All</option>
          <option value="fake">Fake</option>
          <option value="nonfake">Non‑fake</option>
        </select>

        <label class="ml-4 text-sm font-medium text-gray-700">Page size</label>
        <select class="rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                :value="newsStore.listPageSize" @change="onChangePageSize">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
    </header>

    <div class="mb-3 text-sm text-gray-600">
      <span>Showing
        <strong>
          {{ (newsStore.listPage - 1) * newsStore.listPageSize + 1 }}
          -
          {{ Math.min(newsStore.listPage * newsStore.listPageSize, newsStore.filteredNews.length) }}
        </strong>
        of <strong>{{ newsStore.filteredNews.length }}</strong>
      </span>
    </div>

    <div v-if="newsStore.pagedNews.length === 0" class="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500">
      No news to display.
    </div>

    <ul class="grid gap-4 sm:grid-cols-2">
      <li v-for="n in newsStore.pagedNews" :key="n.id" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-lg font-semibold leading-snug">{{ n.title }}</h2>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              newsStore.computedStatusByNewsId(n.id)
                ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200'
                : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200'
            ]"
          >{{ newsStore.computedStatusByNewsId(n.id) ? 'Fake' : 'Non‑fake' }}</span>
        </div>
        <p class="mt-2 text-sm text-gray-700">{{ truncate(n.summary, 180) }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>Reporter: <strong class="text-gray-700">{{ n.reporter }}</strong></span>
          <span>Reported: {{ formatDate(n.reportedAt) }}</span>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <router-link :to="{ name: 'news-details', params: { id: n.id } }"
                       class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View details
          </router-link>
          <router-link :to="{ name: 'news-vote', params: { id: n.id } }"
                       class="text-sm font-medium text-blue-600 hover:text-blue-700">
            Vote
          </router-link>
        </div>
      </li>
    </ul>

    <nav class="mt-6 flex items-center justify-between">
      <button type="button" @click="goPrev"
              class="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="newsStore.listPage <= 1">
        Prev
      </button>
      <div class="text-sm text-gray-700">Page {{ newsStore.listPage }} of {{ totalPages }}</div>
      <button type="button" @click="goNext"
              class="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="newsStore.listPage >= totalPages">
        Next
      </button>
    </nav>
  </section>
</template>


