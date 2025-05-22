<script setup>
import { ref, onMounted } from 'vue';
import { myAxios } from '@/axios.ts';
import LoadNav from '@/components/LoadNav.vue'
import navData from '@/assets/adminNavigation.json'
import Image from '@/components/images/Image.vue'
import ImageUpload from '@/components/images/ImageUpload.vue'
import ImageFolder from '@/components/images/ImageFolder.vue'

const filesJson = ref({})

async function handleUploaded() {
	const response = await myAxios.get('ronly/images')
	filesJson.value = response.data;
}

onMounted(async () => {
	const response = await myAxios.get('ronly/images')
	filesJson.value = response.data;
	console.log(filesJson.value);
})

</script>


<!-- Use an infinite grid to display the files and dirs in images. -->
<!-- Add a space on top to add a file. -->
<template>
	<title>Image Galery</title>
<div class="h-screen flex flex-col">
	<div class="w-full z-50">
		<LoadNav :navData />
	</div>

	<div class="grid grid-cols-6 gap-4 z-1 h-48 m-8">
		<!-- grid-cols-4 = 4 cells on the x-axis -->
		<!-- This will grow vertically as you add more items -->

		<!-- Make a component which takes the filesJson as a prop so we know children exists? -->
		<ImageUpload @uploadSucces="handleUploaded" />
		<div v-for="item in filesJson?.children" class="h-62 rounded-2xl">
			<ImageFolder v-if="item.is_dir" />
			<Image v-else :imageUrl="item.path"/>
		</div>
		<!-- ... add as many as you want -->
	</div>

</div>
</template>
