<script setup>
import { ref, computed, onMounted } from 'vue';
import { parsePressBlocks, pressBlockType } from '@/library/pressParser';

const props = defineProps({
  document: String,
});

const parsedData = computed(() => {
  if (props.document !== undefined) {
    return parsePressBlocks(props.document);
  }
  return {};
})

</script>

<template>

<div class="absolute top-1/16 left-1/16">
  <div v-for="block in parsedData">
    <component v-if="block.type === pressBlockType.COMPONENT" :is="block.name"><span v-html="block.slot"></span></component>

    <div v-else>
      <pre>{{ block.text }}</pre>
    </div>
  </div>
</div>
</template>
