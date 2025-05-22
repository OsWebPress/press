<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { myAxios } from '@/axios.ts';
import { useRoute } from 'vue-router';
import Rendering from '@/components/render/Rendering.vue'
import LoadNav from '@/components/LoadNav.vue'
import config from '@/assets/config.json'

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
	<header>
		<title> {{ TITLE }} </title>
		<div class="fixed w-full z-50">
			<LoadNav />
		</div>
	</header>
  <main>

	<div v-if="loading">loading..</div>
	<Rendering v-else :document="document"/>

  </main>
</template>
