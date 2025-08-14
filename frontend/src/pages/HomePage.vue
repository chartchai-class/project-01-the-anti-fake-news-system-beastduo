
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import NewsCard from '../components/NewsCard.vue'
import TrustScoreBar from '../components/TrustScoreBar.vue'
import { computed as vueComputed } from 'vue'

const searchTerm = ref('')
const newsStore = useNewsStore()
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()

const totalPages = computed(() => {
  const total = newsStore.filteredNews.length
  const perPage = newsStore.listPageSize || 1
  return Math.max(1, Math.ceil(total / perPage))
})

// Filtered news by search
const searchedNews = computed(() => {
  if (!searchTerm.value.trim()) return newsStore.filteredNews
  const term = searchTerm.value.trim().toLowerCase()
  return newsStore.filteredNews.filter(n =>
    n.title.toLowerCase().includes(term) ||
    n.summary.toLowerCase().includes(term)
  )
})

// Update totalPages and pagedNews to use searchedNews
const searchedTotalPages = computed(() => {
  const total = searchedNews.value.length
  const perPage = newsStore.listPageSize || 1
  return Math.max(1, Math.ceil(total / perPage))
})

const searchedPagedNews = computed(() => {
  const start = (newsStore.listPage - 1) * newsStore.listPageSize
  const end = start + newsStore.listPageSize
  return searchedNews.value.slice(start, end)
})


// On mount, sync state from query params
onMounted(() => {
  const page = parseInt(route.query.page)
  const size = parseInt(route.query.size)
  if (!isNaN(page) && page > 0) newsStore.setPage(page)
  if (!isNaN(size) && [5,10,20].includes(size)) newsStore.setPageSize(size)
  setTimeout(() => { isLoading.value = false }, 900)
})


// Watch for page/size/filter changes and update URL
watch(
  () => [newsStore.listPage, newsStore.listPageSize, newsStore.listFilter],
  ([page, size, filter]) => {
    const query = { ...route.query, page, size }
    // Optionally add filter to query if you want
    // query.filter = filter
    router.replace({ query })
  }
)

// Keep page in bounds

// Watch for page out of bounds with search
watch(
  () => [newsStore.listPage, searchedTotalPages.value],
  () => {
    if (newsStore.listPage > searchedTotalPages.value) {
      newsStore.setPage(searchedTotalPages.value)
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
  if (newsStore.listPage > 1) {
    isLoading.value = true
    newsStore.setPage(newsStore.listPage - 1)
    setTimeout(() => {
      isLoading.value = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }
}

function goNext() {
  if (newsStore.listPage < searchedTotalPages.value) {
    isLoading.value = true
    newsStore.setPage(newsStore.listPage + 1)
    setTimeout(() => {
      isLoading.value = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }
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

// Google-style pagination logic
const paginationPages = vueComputed(() => {
  const total = searchedTotalPages.value
  const current = newsStore.listPage
  const delta = 2 // how many pages to show before/after current
  const range = []
  const rangeWithDots = []
  let l
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l > 2) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }
  return rangeWithDots
})

function goToPage(page) {
  if (typeof page === 'number' && page !== newsStore.listPage) {
    isLoading.value = true
    newsStore.setPage(page)
    setTimeout(() => {
      isLoading.value = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }
}
</script>

<template>
  <!-- Dynamic background gradient for Sky Sports style (bonus: animate for effect) -->
  <div class="min-h-screen bg-gradient-to-br from-[#002b5c] via-[#ffffff] to-[#e10600]">
    <!-- Removed duplicate Global Header -->
    <main class="w-full px-4 sm:px-8 py-8">
      <!-- Stats Bar (bonus: add live stats here) -->
      <!-- <div class="mb-4 flex justify-center gap-6 rounded bg-white/80 py-2 text-center text-sm font-semibold text-[#002b5c] shadow">
        <span>Total Fake Reports: X</span>
        <span>|</span>
        <span>Non-Fake Reports: Y</span>
      </div> -->

      <!-- Filter & Page Size Controls (sticky on scroll: bonus) -->
      <section class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sticky top-16 z-10 bg-white/80 backdrop-blur rounded shadow">
        <div class="flex flex-wrap items-center gap-3">
          <label for="filter" class="text-sm font-bold text-[#002b5c]"> Filter</label>
          <select id="filter" aria-label="Filter news" class="rounded border border-[#002b5c] bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]"
                  :value="newsStore.listFilter" @change="onChangeFilter">
            <option value="all">All</option>
            <option value="fake">Fake</option>
            <option value="nonfake">Non‑fake</option>
          </select>

          <label for="page-size" class="ml-4 text-sm font-bold text-[#002b5c]">Page size</label>
          <select id="page-size" aria-label="Select page size" class="rounded border border-[#002b5c] bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]"
                  :value="newsStore.listPageSize" @change="onChangePageSize">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
          </select>
        </div>
        <div class="flex items-center w-full sm:w-auto justify-end">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search news..."
            class="w-full sm:w-64 rounded border border-[#002b5c] px-4 py-2 text-base focus:ring-2 focus:ring-[#e10600]"
            aria-label="Search news"
          />
        </div>
        <!-- Live refresh button (bonus) -->
        <!-- <button class="rounded bg-[#e10600] px-4 py-2 text-white font-bold shadow hover:bg-[#b80000] transition">Refresh</button> -->
      </section>

      <!-- Top Stories (bonus: trending items) -->
      <!-- <section class="mb-6"> ... </section> -->

      <!-- Showing X-Y of Z -->
      <div class="mb-3 text-sm text-[#a1b2b9]">
        <span>Showing
          <strong>
            {{ (newsStore.listPage - 1) * newsStore.listPageSize + 1 }}
            -
            {{ Math.min(newsStore.listPage * newsStore.listPageSize, searchedNews.length) }}
          </strong>
          of <strong>{{ searchedNews.length }}</strong>
        </span>
      </div>

      <!-- Centered Loading Spinner for Pagination -->
      <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
        <div class="flex flex-col items-center gap-4">
          <svg class="animate-spin h-12 w-12 text-[#e10600]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span class="text-[#e10600] font-bold text-lg">Loading...</span>
        </div>
      </div>

      <!-- No news state -->
      <div v-else-if="searchedPagedNews.length === 0" class="rounded border-2 border-dashed border-[#e10600] p-8 text-center text-[#e10600] bg-white/80">
        No news to display.
      </div>

      <!-- News Card List -->
      <ul v-else class="grid gap-5 sm:grid-cols-2">
        <NewsCard
          v-for="n in searchedPagedNews"
          :key="n.id"
          :news="n"
          :isFake="newsStore.computedStatusByNewsId(n.id)"
          :formatDate="formatDate"
          :truncate="truncate"
          :fakeVotes="(newsStore.votesByNewsId[n.id] || []).filter(v => v.status === 'fake' || v.isFake === true).length"
          :notFakeVotes="(newsStore.votesByNewsId[n.id] || []).filter(v => v.status === 'nonfake' || v.isFake === false).length"
        />
      </ul>

      <!-- Pagination Controls -->
      <nav class="mt-8 flex items-center justify-center gap-4">
        <button type="button" @click="goPrev"
                class="rounded bg-white border-2 border-[#002b5c] px-4 py-2 text-base font-bold text-[#002b5c] shadow hover:bg-[#002b5c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e10600] disabled:cursor-not-allowed disabled:opacity-50 transition"
                :disabled="newsStore.listPage <= 1"
                aria-label="Previous page">
          Prev
        </button>
        <ul class="flex items-center gap-1">
          <li v-for="page in paginationPages" :key="page">
            <button
              v-if="page !== '...'"
              type="button"
              @click="goToPage(page)"
              :class="[
                'w-9 h-9 rounded font-bold transition',
                page === newsStore.listPage
                  ? 'bg-[#e10600] text-white border-2 border-[#e10600] shadow'
                  : 'bg-white text-[#002b5c] border-2 border-[#002b5c] hover:bg-[#002b5c] hover:text-white',
                'focus:outline-none focus:ring-2 focus:ring-[#e10600]'
              ]"
              :disabled="page === newsStore.listPage"
              :aria-current="page === newsStore.listPage ? 'page' : undefined"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-[#a1b2b9]">…</span>
          </li>
        </ul>
        <button type="button" @click="goNext"
                class="rounded bg-white border-2 border-[#e10600] px-4 py-2 text-base font-bold text-[#e10600] shadow hover:bg-[#e10600] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#002b5c] disabled:cursor-not-allowed disabled:opacity-50 transition"
                :disabled="newsStore.listPage >= searchedTotalPages"
                aria-label="Next page">
          Next
        </button>
      </nav>

    </main>
    <!-- Animated transitions, sticky controls, and other bonus features can be added as marked above. -->
  </div>
</template>


