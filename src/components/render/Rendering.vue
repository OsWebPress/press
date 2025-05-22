<script setup>
import { ref, onMounted } from 'vue';
import { parsePressBlocks, pressBlockType } from '@/library/pressParser';
import Markdown from '@/components/render/Markdown.vue'
import LoadComponent from '@/components/render/LoadComponent.vue'

const props = defineProps({
  document: String,
});

const parsedData = ref([]);

onMounted(() => {
  if (props.document !== undefined && props.document !== ""){
    parsedData.value = parsePressBlocks(props.document);
  }
  setTimeout(() => {
    parsedData.value = [...parsedData.value]
  }, 1000)
})



</script>

<template>

<div class="absolute top-1/16 left-1/16 w-7/8">
  <div v-for="(block, index) in parsedData" :key="index">
	<LoadComponent v-if="block.type === pressBlockType.COMPONENT" :component='block.name'><span v-html="block.slot"></span></LoadComponent>

    <div v-else>
       <Markdown :markdown="block.text"/>
    </div>
  </div>
</div>
</template>
