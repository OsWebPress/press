<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { myAxios } from '@/axios.ts';
import { useRoute } from 'vue-router';
import LoadNav from '@/components/LoadNav.vue'
import config from '@/assets/config.json'
import Makedown from '@/components/render/Makedown.vue';

const TITLE = config.title;

const route = useRoute();
const document = ref("");
const loading = ref(true);

onBeforeMount(async () => {
	document.value = await getDocument(route.fullPath);
	loading.value = false;


})

watch(route, async (newRoute) => {
	loading.value = true;
	document.value = await getDocument(route.fullPath);
	loading.value = false;
});

async function getDocument(route: string): Promise<string> {
	try {
		const response = await myAxios.get("carbon" + route + ".md");
		return response.data;
	} catch (error) {
		if (route !== '/404') {
			return await getDocument('/404');
		} else {
			console.error("error fetching /404 document", error);
			return "404 page unavailable";
		}
	}
}

</script>

<template>
<div class="grid grid-rows-[auto_1fr] min-h-screen">
	<header class="sticky top-0 z-50">
		<LoadNav />
	</header>
	<main>
		<div v-if="loading">loading..</div>
		<Makedown v-else :content="document" class="ml-24 pt-8 mr-8 max-w-4xl" />
	</main>
</div>
</template>
