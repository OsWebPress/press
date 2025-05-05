<script setup>
import { ref, onMounted } from 'vue'
const API_URL = import.meta.env.VITE_API_URL;

const emit = defineEmits();
const mdImage = ref('');

const props = defineProps({
	imageUrl: String
});

function exit(event) {
	if (event.target !== event.currentTarget)
		return;
	emit("closePopOut")
}

function copyMD(event) {
	navigator.clipboard.writeText(mdImage.value)
	// navigator.clipboard.writeText(`![alt text](${props.imageUrl})`)
	animate_ping(event)
}

function animate_ping(event) {
    const btn = event.currentTarget;
    btn.classList.add('animate-ping');

    // Remove the class after animation finishes (~1s)
    setTimeout(() => {
      btn.classList.remove('animate-ping');
    }, 1000);
}

onMounted(() => {
	mdImage.value = `![alt text](${props.imageUrl.replace(/ /g, '%20')})`;
})

</script>

<template>
<div @click="exit($event)" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white/50">
	<div @click="exit($event)" class="w-3/4 h-3/4 flex flex-col items-center" >
		<button @click="copyMD" class="bg-gray-400 px-4 py-2">Copy markdown for image.</button>
		<img :src="props.imageUrl" class="h-full object-scale-down">
	</div>

</div>
</template>