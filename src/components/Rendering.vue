<script setup>
import { ref, computed } from 'vue';
import { parsePressBlocks, pressBlockType } from '@/library/pressParser';

// User input text
const inputText = ref(``);

const parsedData = computed(() => {
  return parsePressBlocks(inputText.value);
})

</script>

<template>

<div class="bg-red-800 rounded-lg p-2">{{ parsedData }}</div>

<div class="flex gap-4 p-4 min-h-[400px]">
  <!-- Left Section -->

  <div class="flex-col w-1/2">
  <div v-for="block in parsedData">
    <component v-if="block.type === pressBlockType.COMPONENT" :is="block.name"><span v-html="block.slot"></span></component>

    <div v-else>
      <p>{{ block.text }}</p>
    </div>
  </div>
  </div>

  <!-- Right Section -->
    <textarea class="w-1/2 min-h-[200px] bg-blue-200 text-blue-900 rounded-lg p-2" v-model="inputText" placeholder="Input text box:"></textarea>
</div>
</template>
