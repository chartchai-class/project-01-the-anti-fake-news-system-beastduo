<template>
  <form @submit.prevent="submitVote" class="rounded-xl border-2 border-[#002b5c]/10 bg-white p-6 shadow-lg space-y-6">
    <div>
      <h2 class="text-lg font-bold text-[#002b5c] mb-2">Vote on: {{ newsTitle }}</h2>
    </div>
    <div>
      <label class="block text-sm font-bold text-[#002b5c] mb-1">Your Vote <span class="text-red-600">*</span></label>
      <div class="flex gap-4">
        <label class="inline-flex items-center gap-1">
          <input type="radio" name="status" value="fake" v-model="status" class="accent-[#e10600] focus:ring-2 focus:ring-[#e10600]" required />
          <span class="text-[#e10600] font-bold">Fake</span>
        </label>
        <label class="inline-flex items-center gap-1">
          <input type="radio" name="status" value="nonfake" v-model="status" class="accent-[#002b5c] focus:ring-2 focus:ring-[#002b5c]" required />
          <span class="text-[#002b5c] font-bold">Non-fake</span>
        </label>
      </div>
    </div>
    <div>
      <label for="comment" class="block text-sm font-bold text-[#002b5c] mb-1">Comment (optional)</label>
      <textarea id="comment" v-model="comment" rows="3" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#002b5c]" placeholder="Share your reasoning..."></textarea>
    </div>
    <div>
      <label for="imageUrl" class="block text-sm font-bold text-[#002b5c] mb-1">Image URL (optional)</label>
      <input id="imageUrl" v-model="imageUrl" type="url" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e10600]" placeholder="https://example.com/image.jpg" />
    </div>
    <div v-if="error" class="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{{ error }}</div>
    <button type="submit" :disabled="submitting" class="w-full rounded bg-[#e10600] px-4 py-2 text-white font-bold shadow hover:bg-[#b80000] focus:outline-none focus:ring-2 focus:ring-[#002b5c] transition disabled:opacity-50">Submit Vote</button>
    <div v-if="showToast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded bg-green-600 px-6 py-3 text-white font-bold shadow-lg animate-bounce">Vote submitted!</div>
  </form>
</template>
<script setup>
const props = defineProps({
  newsTitle: String,
  status: String,
  comment: String,
  imageUrl: String,
  error: String,
  submitting: Boolean,
  showToast: Boolean,
  submitVote: Function
})
</script>
