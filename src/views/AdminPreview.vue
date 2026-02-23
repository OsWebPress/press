<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { myAxios } from '@/axios.ts';
import LoadNav from '@/components/LoadNav.vue'
import config from '@/assets/config.json'
import Makedown from '@/components/render/Makedown.vue';

const TITLE = config.title;

const loading = ref(true);
const background = ref("");
const content = ref(localStorage.getItem('previewContent') || '')

onBeforeMount(async () => {
	background.value = await getBackground();
	loading.value = false;
})

// for iframe updates
window.addEventListener('message', (e) => {
  content.value = e.data.content
})

// for standalone tab updates
window.addEventListener('storage', (e) => {
  if (e.key === 'previewContent') {
    content.value = e.newValue
  }
})

async function getBackground(): Promise<string> {
	try {
		const response = await myAxios.get("carbon/background.md");
		return response.data;
	} catch (error) {
		console.error("error fetching background document", error);
		return "";
	}
}

</script>

<template>
<div class="top-0 z--10 bg-blue-100 w-full h-full fixed">
	<Makedown :content="background"/>
</div>
<div class="grid grid-rows-[auto_1fr] min-h-screen">
	<header class="sticky top-0 z-50">
		<LoadNav />
	</header>
	<main>
		<div v-if="loading">loading..</div>
		<Makedown v-else :content="content" class="pl-24 pr-8 max-w-4xl" />
	</main>
</div>
</template>
