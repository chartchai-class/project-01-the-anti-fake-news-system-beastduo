<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from './stores/news'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const newsStore = useNewsStore()
const router = useRouter()

// NProgress config for YouTube style
NProgress.configure({ showSpinner: false, trickleSpeed: 200 })
const nprogressStyle = document.createElement('style')
nprogressStyle.innerHTML = `#nprogress .bar { background: #e10600 !important; height: 2px !important; } #nprogress .peg { box-shadow: 0 0 10px #e10600, 0 0 5px #e10600 !important; }`;
document.head.appendChild(nprogressStyle)

let unregisterStart, unregisterEnd
onMounted(() => {
  newsStore.loadSeeds()
  newsStore.hydrateFromLocalStorage()
  unregisterStart = router.beforeEach((to, from, next) => { NProgress.start(); next(); })
  unregisterEnd = router.afterEach(() => { NProgress.done(); })
})
onUnmounted(() => {
  if (unregisterStart) unregisterStart()
  if (unregisterEnd) unregisterEnd()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#002b5c] via-[#ffffff] to-[#e10600]">
    <!-- Global Header -->
    <header class="sticky top-0 z-30 w-full bg-[#002b5c] shadow-lg">
      <nav class="flex w-full items-center justify-between px-8 py-3">
        <div class="flex items-center gap-3">
          <img src="/beastduo-logo.jpg" alt="BEAST DUO Logo" class="h-10 w-10 rounded bg-white p-1 shadow" />
          <span class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <router-link to="/" class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-[#e10600] rounded transition group" aria-label="Go to Home">
              <span class="text-2xl font-extrabold tracking-tight text-[#2aafc7] drop-shadow-sm leading-tight group-hover:text-[#e10600] transition">BEAST DUO</span>
              <span class="rounded-lg px-3 py-1 text-base font-bold bg-[#e10600] text-white shadow-sm mt-1 sm:mt-0 whitespace-nowrap group-hover:bg-[#2aafc7] group-hover:text-[#002b5c] transition" style="letter-spacing:0.01em;">Anti-Fake News</span>
            </router-link>
          </span>
        </div>
        <ul class="flex gap-6 text-base font-semibold">
          <li><router-link to="/" class="text-white hover:text-[#e10600] focus:outline-none focus:ring-2 focus:ring-white rounded transition">Home</router-link></li>
          <li><router-link to="/about" class="text-white hover:text-[#e10600] focus:outline-none focus:ring-2 focus:ring-white rounded transition">About</router-link></li>
        </ul>
      </nav>
    </header>
    <div>
      <div v-if="!newsStore.hydrated" class="py-20 text-center text-gray-500">
        Loading data...
      </div>
      <router-view v-else />
    </div>

  <!-- Footer -->
  <footer class="bg-[#002b5c] text-white py-4 mt-8 shadow-inner">
    <div class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
      <span class="font-bold">Social Anti-Fake News System</span>
      <span>© 2025 BeastDuo Team</span>
      <span class="hidden sm:inline">For educational use only</span>
    </div>
  </footer>
</div>
</template>

<style>
html, body, #app {
  height: 100%;
}
.min-h-screen {
  min-height: 100vh;
}
</style>

