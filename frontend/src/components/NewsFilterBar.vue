<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
    <div class="flex flex-1 gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="[
          'px-4 py-2 rounded-full font-bold border-2 transition',
          filter === f.value
            ? f.value === 'fake'
              ? 'bg-[#E30613] border-[#E30613] text-white shadow-lg'
              : f.value === 'notfake'
                ? 'bg-green-600 border-green-600 text-white shadow-lg'
                : 'bg-[#005BAC] border-[#005BAC] text-white shadow-lg'
            : 'bg-white border-gray-300 text-[#005BAC] hover:bg-blue-50'
        ]"
        @click="$emit('update:filter', f.value)"
      >
        {{ f.label }}
      </button>
    </div>
    <div class="flex items-center gap-2 mt-2 sm:mt-0">
      <input
        v-model="search"
        @input="$emit('update:search', search)"
        type="text"
        placeholder="Search by topic..."
        class="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005BAC] text-sm w-48"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  filter: String,
  search: String
})
const emit = defineEmits(['update:filter', 'update:search'])
const filters = [
  { label: 'All', value: 'all' },
  { label: 'Fake', value: 'fake' },
  { label: 'Not Fake', value: 'notfake' }
]
const search = ref(props.search || '')
watch(() => props.search, val => { search.value = val })
</script>

<style scoped>
</style>
