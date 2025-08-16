<script setup>
import CommentList from '../components/CommentList.vue'
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

const voteCounts = computed(() => newsStore.voteCountsByNewsId(newsId.value))
const fakeCount = computed(() => voteCounts.value.fakeCount)
const nonFakeCount = computed(() => voteCounts.value.nonFakeCount)


const pageSize = ref(5)
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(comments.value.length / pageSize.value)))
const pagedComments = computed(() => comments.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))

const isCommentLoading = ref(false)

function goBack() {
  router.push({ name: 'home' })
}
function goVote() {
  router.push({ name: 'news-vote', params: { id: newsId.value } })
}
function goPage(p) {
  if (p >= 1 && p <= totalPages.value) {
    isCommentLoading.value = true
    setTimeout(() => {
      page.value = p
      isCommentLoading.value = false
    }, 500)
  }
}
function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch { return iso }
}

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'auto' })
  isLoading.value = true
  newsDetail.value = await fetchNewsDetailById(newsId.value)
  setTimeout(() => { isLoading.value = false }, 500)
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-[#002b5c] via-[#ffffff] to-[#e10600] pb-12">
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div class="relative flex flex-col items-center mb-6 gap-2">
        <button class="absolute left-0 top-0 text-sm text-gray-200 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-100 rounded" @click="goBack">← Back</button>
        <h1 class="text-2xl font-extrabold text-[#002b5c] tracking-tight text-center mb-1">News Details</h1>
        <nav v-if="newsDetail" class="flex justify-center gap-8 py-4">
          <RouterLink
            class="px-4 py-2 rounded font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-green-600 transition-colors shadow"
            :to="{ name: 'news-details', params: { id: newsDetail.id } }"
            exact-active-class="ring-2 ring-blue-400"
          >Details</RouterLink>
          <RouterLink
            class="px-4 py-2 rounded font-bold text-green-700 bg-green-100 hover:bg-green-200 hover:text-blue-600 transition-colors shadow"
            :to="{ name: 'news-vote', params: { id: newsDetail.id } }"
            exact-active-class="ring-2 ring-green-400"
          >Vote</RouterLink>
        </nav>
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
                : 'bg-[#002b5c]/10 text-[#038619] ring-[#038619]'
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
        </div>

        <!-- CommentList with skeleton loading -->
        <div class="mt-6" data-testid="comments-section">
          <CommentList
            v-if="!isCommentLoading"
            :comments="comments"
            :pagedComments="pagedComments"
            :page="page"
            :totalPages="totalPages"
            :goPage="goPage"
            :formatDate="formatDate"
          />
          <ul v-else class="space-y-4" data-testid="comments-skeleton">
            <li v-for="i in pageSize" :key="i" class="rounded border bg-gray-50 p-3 shadow-sm animate-pulse">
              <div class="flex items-center gap-2 mb-1">
                <span class="h-4 w-16 bg-gray-200 rounded"></span>
                <span class="h-3 w-12 bg-gray-100 rounded"></span>
              </div>
              <div class="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 w-1/2 bg-gray-100 rounded"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>


