<template>
  <nav class="w-full bg-[#005BAC] text-white flex items-center justify-between px-4 py-3 shadow-md">
    <div class="flex items-center gap-2">
      <router-link to="/" class="flex items-center gap-2 group">
        <span class="font-extrabold text-2xl tracking-tight group-hover:underline">BEASTDUO</span>
        <span class="ml-2 text-base font-bold bg-[#E30613] px-2 py-0.5 rounded text-white group-hover:bg-[#b8000f] transition">Anti-Fake News</span>
      </router-link>
    </div>
    <div class="flex gap-4 items-center">
      <router-link to="/" class="font-bold hover:text-[#E30613] transition">Home</router-link>
      <router-link to="/about" class="font-bold hover:text-[#E30613] transition">About</router-link>
      <router-link to="/contact" class="font-bold hover:text-[#E30613] transition">Contact</router-link>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
</style>
