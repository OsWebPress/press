<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import '@/assets/markdown.css';

const props = defineProps({
	markdown: String,
})

const html_content = computed(() => {
	marked.use({
		gfm: true,
		breaks: true,
	})

	return marked.parse(props.markdown.replace(/^>\s*$/gm, '> &nbsp;').replace(/^\s*$/gm, '\n<br>\n'));
})

</script>

<template>
	<div v-html="html_content">
	</div>
</template>
