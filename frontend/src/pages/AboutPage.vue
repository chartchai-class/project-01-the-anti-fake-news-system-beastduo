<script setup>
import site from '../config/site.js'

const appTitle = document.title || 'Social Anti‑Fake News System'
</script>

<template>
  <main class="mx-auto max-w-5xl px-6 py-10 text-[#002b5c]">
    <section class="rounded-xl bg-white/90 p-6 shadow">
      <h1 class="mb-2 text-3xl font-extrabold tracking-tight">About</h1>
      <p class="mb-6 text-sm text-gray-600">{{ appTitle }}</p>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-bold">Website</h2>
            <ul class="mt-2 space-y-1 text-sm">
              <li><span class="font-semibold">Name:</span> {{ site.name || appTitle }}</li>
              <li><span class="font-semibold">URL:</span>
                <span v-if="site.url">
                  <a :href="site.url" target="_blank" rel="noreferrer" class="text-[#e10600] hover:underline">{{ site.url }}</a>
                </span>
                <span v-else>—</span>
              </li>
              <li v-if="site.description"><span class="font-semibold">Description:</span> {{ site.description }}</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold">Links</h2>
            <ul class="mt-2 space-y-1 text-sm">
              <li>
                <span class="font-semibold">Repository:</span>
                <span v-if="site.repoUrl">
                  <a :href="site.repoUrl" target="_blank" rel="noreferrer" class="text-[#e10600] hover:underline">{{ site.repoUrl }}</a>
                </span>
                <span v-else>—</span>
              </li>
              <li>
                <span class="font-semibold">Demo video:</span>
                <span v-if="site.demoUrl">
                  <a :href="site.demoUrl" target="_blank" rel="noreferrer" class="text-[#e10600] hover:underline">{{ site.demoUrl }}</a>
                </span>
                <span v-else>—</span>
              </li>
              <li v-if="site.contactEmail">
                <span class="font-semibold">Contact:</span>
                <a :href="`mailto:${site.contactEmail}`" class="text-[#e10600] hover:underline">{{ site.contactEmail }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-bold">Team</h2>
            <ul class="mt-2 list-inside list-disc text-sm">
              <li v-for="member in site.team" :key="member.id">
                <span class="font-semibold">{{ member.name }}</span>
                <span v-if="member.id"> ({{ member.id }})</span>
                <span v-if="member.section"> – {{ member.section }}</span>
              </li>
              <li v-if="!site.team || site.team.length === 0" class="text-gray-500">—</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-bold">Technology</h2>
            <ul class="mt-2 list-inside list-disc text-sm text-gray-700">
              <li>Vue 3 + Vite</li>
              <li>Vue Router</li>
              <li>Pinia</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>


