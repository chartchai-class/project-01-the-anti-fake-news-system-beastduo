<template>
  <div class="flex flex-wrap items-center gap-3">
    <label for="filter" class="text-sm font-bold text-[#002b5c]"> Filter</label>
    <select id="filter" aria-label="Filter news" class="rounded border border-[#002b5c] bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]"
            :value="modelValue.filter" @change="$emit('update:filter', $event.target.value)">
      <option value="all">All</option>
      <option value="fake">Fake</option>
      <option value="nonfake">Non‑fake</option>
    </select>

    <label for="page-size" class="ml-4 text-sm font-bold text-[#002b5c]">Page size</label>
    <select id="page-size" aria-label="Select page size" class="rounded border border-[#002b5c] bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]"
            :value="modelValue.pageSize" @change="$emit('update:pageSize', Number($event.target.value))">
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="15">15</option>
      <option :value="20">20</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true }
})
</script>
