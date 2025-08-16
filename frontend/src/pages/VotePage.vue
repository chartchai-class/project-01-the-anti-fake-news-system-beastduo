<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const newsId = computed(() => String(route.params.id || ''))
const newsItem = ref(null)
// Remove local isLoading since data is immediately available

import { onMounted } from 'vue'
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })
  // No loading state needed - data is immediately available
  newsItem.value = newsStore.news.find(n => n.id === newsId.value)
})

const status = ref('')
const comment = ref('')
const imageUrl = ref('')
const error = ref('')
const submitting = ref(false)
const showToast = ref(false)

function goToDetails() {
  router.push({ name: 'news-details', params: { id: newsId.value } })
}

function validate() {
  if (!status.value) {
    error.value = 'Please select Fake or Non-fake.'
    return false
  }
  if (imageUrl.value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl.value)) {
    error.value = 'Image URL must be a valid image link.'
    return false
  }
  error.value = ''
  return true
}

async function submitVote() {
  if (!validate()) return
  submitting.value = true
  try {
    // Map status to isFake for store
    const isFake = status.value === 'fake'
    await newsStore.addVoteAndOptionalComment({
      newsId: newsId.value,
      isFake,
      text: comment.value,
      imageUrl: imageUrl.value
    })
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
      goToDetails()
    }, 1200)
  } catch (e) {
    error.value = 'Failed to submit vote.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-[#002b5c] via-[#ffffff] to-[#e10600] pb-12">
    <div class="mx-auto max-w-md px-4 py-8">
      <div class="relative flex flex-col items-center mb-6 gap-2">
        <h1 class="text-2xl font-extrabold text-[#002b5c] tracking-tight text-center mb-1">Vote</h1>
        <nav class="flex justify-center gap-8 py-4">
          <RouterLink
            v-if="newsItem"
            class="px-4 py-2 rounded font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-green-600 transition-colors shadow"
            :to="{ name: 'news-details', params: { id: newsItem.id } }"
            exact-active-class="ring-2 ring-blue-400"
          >Details</RouterLink>
          <span v-else class="px-4 py-2 rounded font-bold text-blue-300 bg-blue-50 transition-colors shadow cursor-not-allowed opacity-60">Details</span>
          <RouterLink
            v-if="newsItem"
            class="px-4 py-2 rounded font-bold text-green-700 bg-green-100 hover:bg-green-200 hover:text-blue-600 transition-colors shadow"
            :to="{ name: 'news-vote', params: { id: newsItem.id } }"
            exact-active-class="ring-2 ring-green-400"
          >Vote</RouterLink>
          <span v-else class="px-4 py-2 rounded font-bold text-green-300 bg-green-50 transition-colors shadow cursor-not-allowed opacity-60">Vote</span>
        </nav>
      </div>

      <!-- Loading State - Data loads immediately now -->
      <div v-if="!newsItem" class="rounded border-2 border-dashed border-[#e10600] p-8 text-center text-[#e10600] bg-white/80">
        News not found.
      </div>

      <form v-else @submit.prevent="submitVote" class="rounded-xl border-2 border-[#002b5c]/10 bg-white p-6 shadow-lg space-y-6">
        <div>
          <h2 class="text-lg font-bold text-[#002b5c] mb-2">News: {{ newsItem.title }}</h2>
        </div>
        <div>
          <label class="block text-sm font-bold text-[#002b5c] mb-1">Your Vote <span class="text-red-600">*</span></label>
          <div class="flex gap-4">
            <label class="inline-flex items-center gap-1">
              <input type="radio" name="status" value="fake" v-model="status" class="accent-[#e10600] focus:ring-2 focus:ring-[#e10600]" required tabindex="0" />
              <span class="text-[#e10600] font-bold">Fake</span>
            </label>
            <label class="inline-flex items-center gap-1">
              <input type="radio" name="status" value="nonfake" v-model="status" class="accent-[#002b5c] focus:ring-2 focus:ring-[#002b5c]" required tabindex="0" />
              <span class="text-[#002b5c] font-bold">Non-fake</span>
            </label>
          </div>
        </div>
        <div>
          <label for="comment" class="block text-sm font-bold text-[#002b5c] mb-1">Comment (optional)</label>
          <textarea id="comment" v-model="comment" rows="3" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#002b5c]" placeholder="Share your reasoning..." tabindex="0"></textarea>
        </div>
        <div>
          <label for="imageUrl" class="block text-sm font-bold text-[#002b5c] mb-1">Image URL (optional)</label>
          <input id="imageUrl" v-model="imageUrl" type="url" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]" placeholder="https://example.com/image.jpg" tabindex="0" />
        </div>
        <div v-if="error" class="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{{ error }}</div>
        <button type="submit" :disabled="submitting" class="w-full rounded bg-[#e10600] px-4 py-2 text-white font-bold shadow hover:bg-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#002b5c] transition disabled:opacity-50" tabindex="0">Submit Vote</button>
        <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded bg-green-600 px-6 py-3 text-white font-bold shadow-lg animate-bounce">Vote submitted!</div>
      </form>
    </div>
  </main>
</template>


