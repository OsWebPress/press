<script setup>
import Makedown from './Makedown.vue';

const props = defineProps({
  document: String,
});

</script>

<template>
	<div class="absolute top-1/8 left-1/16 w-7/8">
		<Makedown :content="props.document" />
	</div>
</template>
