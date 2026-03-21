<script setup>
import { ref, onMounted } from 'vue'
import ImagePopOut from '@/components/images/ImagePopOut.vue'

const popOut = ref(false)
const imageUrl = ref('')

const props = defineProps({
	imageUrl: String
});

function imagePopOut() {
	popOut.value = !popOut.value
}

onMounted(() => {
	imageUrl.value = `/api/${props.imageUrl}`
})
</script>

<template>
<ImagePopOut v-if="popOut" @closePopOut="imagePopOut" :imageUrl />

<div @click="imagePopOut" class="border border-zinc-700 bg-zinc-800 hover:border-zinc-500 cursor-pointer w-full h-full rounded-2xl overflow-hidden transition-colors">
	<img v-if="imageUrl !== ''" :src="imageUrl" class="w-full h-full object-cover">
</div>
</template>
