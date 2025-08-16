<template>
  <li class="group relative rounded-xl border-2 border-[#002b5c]/10 bg-white p-5 shadow-lg transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#e10600]" tabindex="0" @keydown="handleKeydown">
    <router-link :to="{ name: 'news-details', params: { id: news.id } }" class="block focus:outline-none focus:ring-2 focus:ring-[#e10600]" tabindex="-1">
      <img v-if="news.imageUrl" :src="news.imageUrl" alt="News image" class="w-full h-40 object-cover rounded mb-3 border border-[#002b5c]/10 cursor-pointer" loading="lazy" />
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-lg font-extrabold leading-snug text-[#002b5c] group-hover:text-[#e10600] transition cursor-pointer">{{ news.title }}</h2>
        <span
          :class="[
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-2',
            isFake
              ? 'bg-[#e10600]/10 text-[#e10600] ring-[#e10600]'
              : 'bg-[#002b5c]/10 text-[#0bac18] ring-[#038619]'
          ]"
          :aria-label="isFake ? 'Fake' : 'Non-fake'"
        >{{ isFake ? 'Fake' : 'Non‑fake' }}</span>
      </div>
      <div class="mt-2 mb-1">
        <TrustScoreBar :fakeVotes="fakeVotes" :notFakeVotes="notFakeVotes" />
      </div>
      <p class="mt-2 text-sm text-gray-700 cursor-pointer">{{ truncate(news.summary, 180) }}</p>
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>Reporter: <strong class="text-[#002b5c] cursor-pointer">{{ news.reporterName }}</strong></span>
        <span>Reported: {{ formatDate(news.reportedAt) }}</span>
      </div>
    </router-link>
    <div class="mt-4 flex items-center gap-3">
      <router-link :to="{ name: 'news-details', params: { id: news.id } }"
                   class="rounded px-3 py-1 text-sm font-bold text-white bg-[#002b5c] hover:bg-[#0056b3] focus:outline-none focus:ring-2 focus:ring-[#e10600] transition"
                   tabindex="0">View details</router-link>
      <router-link :to="{ name: 'news-vote', params: { id: news.id } }"
                   class="rounded px-3 py-1 text-sm font-bold text-white bg-[#e10600] hover:bg-[#ff7f0e] focus:outline-none focus:ring-2 focus:ring-[#002b5c] transition"
                   tabindex="0">Vote</router-link>
    </div>
  </li>
</template>

<script setup>
import TrustScoreBar from './TrustScoreBar.vue'
import { computed } from 'vue'

const props = defineProps({
  news: { type: Object, required: true },
  isFake: { type: Boolean, required: true },
  formatDate: { type: Function, required: true },
  truncate: { type: Function, required: true },
  fakeVotes: { type: Number, required: true },
  notFakeVotes: { type: Number, required: true }
})

// Keyboard navigation handler
function handleKeydown(event) {
  const cards = document.querySelectorAll('ul.grid > li[tabindex="0"]')
  const currentIndex = Array.from(cards).indexOf(event.target)
  
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = (currentIndex + 1) % cards.length
    cards[nextIndex].focus()
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1
    cards[prevIndex].focus()
  }
}
</script>
