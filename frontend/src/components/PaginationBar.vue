<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
    <div class="flex items-center gap-2">
      <label for="perPage" class="font-semibold text-[#005BAC]">Per page:</label>
      <select
        id="perPage"
        :value="perPageLocal"
        @change="onPerPageChange"
        class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#005BAC]"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      <button
        :disabled="page === 1"
        @click="$emit('update:page', page - 1)"
        class="px-3 py-1 rounded font-bold border-2 border-[#005BAC] text-[#005BAC] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition"
      >Prev</button>
      <span class="font-semibold text-[#005BAC]">Page {{ page }}</span>
      <button
        :disabled="!hasNext"
        @click="$emit('update:page', page + 1)"
        class="px-3 py-1 rounded font-bold border-2 border-[#005BAC] text-[#005BAC] bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition"
      >Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  page: Number,
  perPage: Number,
  hasNext: Boolean
})
const emit = defineEmits(['update:page', 'update:perPage'])
const perPageLocal = ref(props.perPage)
watch(() => props.perPage, val => { perPageLocal.value = val })
function onPerPageChange(e) {
  const val = Number(e.target.value)
  perPageLocal.value = val
  emit('update:perPage', val)
}
</script>

<style scoped>
</style>
