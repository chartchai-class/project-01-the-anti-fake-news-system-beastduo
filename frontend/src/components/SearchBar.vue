<template>
  <div class="flex items-center w-full sm:w-auto justify-end">
    <input
      v-model="modelValue"
      type="text"
      placeholder="Search news..."
      class="w-full sm:w-64 rounded border border-[#002b5c] px-4 py-2 text-base focus:ring-2 focus:ring-[#e10600]"
      aria-label="Search news"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue'])
</script>
