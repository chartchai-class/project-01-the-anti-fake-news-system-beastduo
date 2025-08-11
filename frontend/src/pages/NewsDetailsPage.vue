<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import { fetchNewsDetailById } from '../utils/newsdetail'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const newsId = computed(() => String(route.params.id || ''))
const isLoading = ref(true)
const newsDetail = ref(null)

// FIX: Use object property access for votes/comments
const comments = computed(() => newsStore.commentsByNewsId[newsId.value] || [])
const votes = computed(() => newsStore.votesByNewsId[newsId.value] || [])

const fakeCount = computed(() => votes.value.filter(v => v.status === 'fake' || v.isFake === true).length)
const nonFakeCount = computed(() => votes.value.filter(v => v.status === 'nonfake' || v.isFake === false).length)

const pageSize = ref(5)
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(comments.value.length / pageSize.value)))
const pagedComments = computed(() => comments.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))

function goBack() {
  router.push({ name: 'home' })
}
function goVote() {
  router.push({ name: 'news-vote', params: { id: newsId.value } })
}
function goPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}
function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch { return iso }
}

onMounted(async () => {
  isLoading.value = true
  newsDetail.value = await fetchNewsDetailById(newsId.value)
  setTimeout(() => { isLoading.value = false }, 500)
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-[#002b5c] via-[#ffffff] to-[#e10600] pb-12">
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div class="relative flex items-center mb-6">
        <button class="text-sm text-gray-200 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-100 rounded z-10" @click="goBack">← Back</button>
        <h1 class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#002b5c] tracking-tight text-center w-full pointer-events-none">News Details</h1>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="space-y-6">
        <div class="h-8 w-2/3 rounded bg-gray-200 animate-pulse"></div>
        <div class="h-5 w-1/3 rounded bg-gray-100 animate-pulse"></div>
        <div class="h-48 w-full rounded bg-gray-100 animate-pulse"></div>
        <div class="h-6 w-1/2 rounded bg-gray-200 animate-pulse"></div>
        <div class="h-20 w-full rounded bg-gray-100 animate-pulse"></div>
      </div>

      <div v-else-if="!newsDetail" class="rounded border-2 border-dashed border-[#e10600] p-8 text-center text-[#e10600] bg-white/80">
        News not found.
      </div>

      <div v-else class="rounded-xl border-2 border-[#002b5c]/10 bg-white p-6 shadow-lg">
        <!-- NewsHeader -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 class="text-xl font-bold text-[#002b5c]">{{ newsDetail.headline }}</h2>
            <div class="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
              <span>Reporter: <strong class="text-[#002b5c]">{{ newsDetail.reporter }}</strong></span>
              <span>Reported: {{ formatDate(newsDetail.reportedAt) }}</span>
            </div>
          </div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-2',
              newsStore.computedStatusByNewsId(newsDetail.id)
                ? 'bg-[#e10600]/10 text-[#e10600] ring-[#e10600]'
                : 'bg-[#002b5c]/10 text-[#002b5c] ring-[#002b5c]'
            ]"
            :aria-label="newsStore.computedStatusByNewsId(newsDetail.id) ? 'Fake' : 'Non-fake'"
          >{{ newsStore.computedStatusByNewsId(newsDetail.id) ? 'Fake' : 'Non‑fake' }}</span>
        </div>

        <!-- ImagePreview -->
        <div v-if="newsDetail.imageUrl" class="mb-4 flex justify-center">
          <img :src="newsDetail.imageUrl" alt="News image" class="max-h-64 rounded-lg border shadow object-contain" />
        </div>

        <!-- News Body -->
        <div class="mb-6 text-gray-800 whitespace-pre-line">{{ newsDetail.body }}</div>

        <!-- VoteSummary -->
        <div class="mb-4 flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-[#e10600]/10 px-2 py-0.5 text-xs font-bold text-[#e10600]">Fake: {{ fakeCount }}</span>
            <span class="rounded-full bg-[#002b5c]/10 px-2 py-0.5 text-xs font-bold text-[#002b5c]">Non-fake: {{ nonFakeCount }}</span>
          </div>
          <button @click="goVote" class="ml-auto rounded bg-[#e10600] px-4 py-2 text-white font-bold shadow hover:bg-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#002b5c] transition">Vote on this news</button>
        </div>

        <!-- CommentList -->
        <div class="mt-6" data-testid="comments-section">
          <h3 class="text-lg font-bold text-[#002b5c] mb-2">Comments</h3>
          <div v-if="comments.length === 0" class="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500 bg-gray-50">
            No comments yet.
          </div>
          <ul v-else class="space-y-4" data-testid="comments-list">
            <li v-for="c in pagedComments" :key="c.id" class="rounded border bg-gray-50 p-3 shadow-sm">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-[#002b5c]">{{ c.author }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(c.createdAt) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ c.text }}</p>
            </li>
          </ul>
          <!-- Pagination for comments -->
          <nav v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2" data-testid="comments-pager">
            <button @click="goPage(page-1)" :disabled="page <= 1" aria-label="Prev comments page" class="rounded px-2 py-1 text-sm font-bold border border-[#002b5c] text-[#002b5c] bg-white disabled:opacity-50">Prev</button>
            <span class="text-sm font-bold text-[#002b5c]" data-testid="comments-page-label">Page {{ page }} of {{ totalPages }}</span>
            <button @click="goPage(page+1)" :disabled="page >= totalPages" aria-label="Next comments page" class="rounded px-2 py-1 text-sm font-bold border border-[#e10600] text-[#e10600] bg-white disabled:opacity-50">Next</button>
          </nav>
        </div>
      </div>
    </div>
  </main>
</template>


