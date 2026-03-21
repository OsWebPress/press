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
const background = ref("");
const footer = ref("");

onBeforeMount(async () => {
	background.value = await getSpecific("carbon/background.md");
	footer.value = await getSpecific("carbon/footer.md");
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

async function getSpecific(path: string): Promise<string> {
	try {
		const response = await myAxios.get(path);
		return response.data;
	} catch (error) {
		console.error("error fetching specific document", path, error);
		return "";
	}
}

</script>

<template>
<div class="top-0 z--10 w-full h-full fixed overflow-hidden pl-3rem md:pl-6rem xl:pl-12rem 2xl:pl-18rem">
	<Makedown :content="background"/>
</div>
<div class="grid grid-rows-[auto_1fr] min-h-screen">
	<header>
		<LoadNav :path="route.fullPath"/>
	</header>
	<main>
		<div v-if="loading">loading..</div>
		<Makedown v-else :content="document" class="pl-3rem md:pl-6rem xl:pl-12rem 2xl:pl-18rem pr-8 max-w-4xl 2xl:max-w-6xl" />
		<Makedown :content="footer" class="pl-3rem md:pl-6rem xl:pl-12rem 2xl:pl-18rem pr-8 max-w-4xl 2xl:max-w-6xl" />
	</main>
</div>
</template>
