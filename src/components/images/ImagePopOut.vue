<script setup>
import { ref, onMounted } from 'vue'

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
	animate_ping(event)
}

function animate_ping(event) {
	const btn = event.currentTarget;
	btn.classList.add('animate-ping');
	setTimeout(() => btn.classList.remove('animate-ping'), 1000);
}

onMounted(() => {
	mdImage.value = `![alt text](${props.imageUrl.replace(/ /g, '%20')})`;
})
</script>

<template>
<div @click="exit($event)" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/70 z-50">
	<div @click="exit($event)" class="w-3/4 h-3/4 flex flex-col items-center gap-4">
		<button @click="copyMD" class="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 px-4 py-2 rounded-lg text-sm transition-colors">
			Copy markdown for image.
		</button>
		<img :src="props.imageUrl" class="h-full object-scale-down rounded-lg">
	</div>
</div>
</template>
