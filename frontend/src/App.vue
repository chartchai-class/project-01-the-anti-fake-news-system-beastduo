<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <div class="max-w-4xl mx-auto p-6">
      <router-view />
    </div>
  </div>
</template>

