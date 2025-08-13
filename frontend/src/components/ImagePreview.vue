<template>
  <div v-if="imageUrl" class="mb-4 flex justify-center">
    <img :src="imageUrl" alt="News image" class="max-h-64 rounded-lg border shadow object-contain" />
  </div>
</template>
<script setup>
const props = defineProps({
  imageUrl: String
})
</script>
