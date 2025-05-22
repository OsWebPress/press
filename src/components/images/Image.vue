<script setup>
import { ref, onMounted } from 'vue'
import ImagePopOut from '@/components/images/ImagePopOut.vue'

// upload dropped or uploaded images to the backend.
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
	<!-- register thsi dis as a drop area (for images). -->
<ImagePopOut v-if="popOut" @closePopOut="imagePopOut" :imageUrl />

<div @click="imagePopOut" class="border-4 border-solid w-full h-full rounded-2xl">
	<img v-if="imageUrl !== ''" :src="imageUrl" class="w-full h-full object-cover rounded-xl">
</div>
</template>