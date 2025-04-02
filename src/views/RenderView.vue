<script setup lang="ts">
import { ref, onMounted } from 'vue';
import instance from '@/main.ts';
import { useRoute } from 'vue-router';
import Rendering from '@/components/Rendering.vue'

const route = useRoute();
const document = ref("");


onMounted(async () => {
	await getDocument(route.fullPath);
})

async function getDocument(route: string)  {
	try {
		const response = await instance.get("carbon" + route);

		document.value = response.data;

	} catch (error) {
		console.error("error fetching document", error);
	}
}

</script>

<template>
  <main>

	<Rendering :document/>

  </main>
</template>
