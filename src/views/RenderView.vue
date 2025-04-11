<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { myAxios } from '@/axios.ts';
import { useRoute } from 'vue-router';
import Rendering from '@/components/Rendering.vue'

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

async function getDocument(route: string) : Promise<string> {
	try {
		const response = await myAxios.get("carbon" + route);
		return response.data

	} catch (error) {
		console.error("error fetching document", error);
	}
	return "";
}

</script>

<template>
  <main>

	<div v-if="loading">loading..</div>
	<Rendering v-else :document="document"/>

  </main>
</template>
