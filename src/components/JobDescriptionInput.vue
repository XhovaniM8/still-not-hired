<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Job Description
      <span class="font-normal text-gray-500">(for keyword matching)</span>
    </label>

    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="6"
      placeholder="Paste the job description here to enable resume matching..."
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
    ></textarea>

    <div v-if="extractedKeywords.length > 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        Extracted Keywords ({{ extractedKeywords.length }})
      </div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="keyword in extractedKeywords"
          :key="keyword"
          class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full"
        >
          {{ keyword }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { extractKeywords } from '@/utils/keywords'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const extractedKeywords = computed(() => {
  if (!props.modelValue) return []
  return extractKeywords(props.modelValue)
})
</script>
