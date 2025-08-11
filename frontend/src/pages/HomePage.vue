<script setup>
import { ref, computed, watch } from 'vue'
import NewsFilterBar from '../components/NewsFilterBar.vue'
import NewsList from '../components/NewsList.vue'
import PaginationBar from '../components/PaginationBar.vue'
import newsDataRaw from '../mock/news.json'
import votesDataRaw from '../mock/votes.json'
const newsData = newsDataRaw.default || newsDataRaw
const votesData = votesDataRaw.default || votesDataRaw
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const filter = ref('all')
const search = ref('')
const page = ref(Number(route.query.page) || 1)
const perPage = ref(Number(route.query.size) || 5)
const loading = ref(false)

function getVotes(newsId) {
  const votes = votesData.filter(v => v.newsId === newsId)
  const fakeVotes = votes.filter(v => v.isFake).length
  const notFakeVotes = votes.filter(v => !v.isFake).length
  const total = fakeVotes + notFakeVotes
  const trustScore = total === 0 ? 50 : Math.round((notFakeVotes / total) * 100)
  return { fakeVotes, notFakeVotes, trustScore }
}

const filteredNews = computed(() => {
  let list = newsData
  if (filter.value === 'fake') list = list.filter(n => n.isFake)
  if (filter.value === 'notfake') list = list.filter(n => !n.isFake)
  if (search.value) list = list.filter(n => n.title.toLowerCase().includes(search.value.toLowerCase()))
  return list
})

const paginatedNews = computed(() => {
  const start = (page.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredNews.value.slice(start, end).map(n => ({
    ...n,
    ...getVotes(n.id)
  }))
})

const hasNext = computed(() => {
  return (page.value * perPage.value) < filteredNews.value.length
})

watch([filter, search, perPage], () => {
  page.value = 1
})

// Sync page/perPage with URL query
watch([page, perPage], ([newPage, newSize]) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage,
      size: newSize
    }
  })
})

// Watch for browser navigation (back/forward)
watch(
  () => [route.query.page, route.query.size],
  ([qPage, qSize]) => {
    if (Number(qPage) !== page.value) page.value = Number(qPage) || 1
    if (Number(qSize) !== perPage.value) perPage.value = Number(qSize) || 5
  }
)

function handleSelect(newsId) {
  router.push({ name: 'news-detail', params: { id: newsId } })
}

function handleFilter(val) {
  filter.value = val
  loading.value = true
  setTimeout(() => loading.value = false, 400)
}
function handleSearch(val) {
  search.value = val
  loading.value = true
  setTimeout(() => loading.value = false, 400)
}
function handlePage(val) {
  page.value = val
  loading.value = true
  setTimeout(() => loading.value = false, 400)
}
function handlePerPage(val) {
  perPage.value = val
  loading.value = true
  setTimeout(() => loading.value = false, 400)
}
</script>

<template>
  <main class="py-4">
    <h1 class="text-3xl font-extrabold text-[#005BAC] mb-2 tracking-tight">Latest News</h1>
    <NewsFilterBar
      :filter="filter"
      :search="search"
      @update:filter="handleFilter"
      @update:search="handleSearch"
    />
    <NewsList
      :newsList="paginatedNews"
      :loading="loading"
      @select="handleSelect"
    />
    <PaginationBar
      :page="page"
      :perPage="perPage"
      :hasNext="hasNext"
      @update:page="handlePage"
      @update:perPage="handlePerPage"
    />
  </main>
</template>


