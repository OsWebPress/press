<script setup>
import { ref } from 'vue'
import { myAxios } from '@/axios.ts'

const props = defineProps({
	folder: { type: String, default: '' }
})
const emit = defineEmits(['uploadSucces'])
const fileInput = ref(null)

function uploadFiles(event) {
	const files = Array.from(event.target.files)
	handleFiles(files)
}

const handleDrop = async (event) => {
	event.preventDefault()
	const files = Array.from(event.dataTransfer.files)
	handleFiles(files)
}

const handleFiles = async (files) => {
	const formData = new FormData()
	files.forEach(file => formData.append('image', file))

	const endpoint = props.folder ? `images/upload/${props.folder}` : 'images/upload/'

	try {
		await myAxios.post(endpoint, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
		emit('uploadSucces')
	} catch (err) {
		console.error('Upload error:', err)
	}
}

const handleDragOver = (event) => event.preventDefault()
</script>

<template>
<div
	class="border border-dashed border-zinc-600 rounded-2xl bg-zinc-800 hover:bg-zinc-700 cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 transition-colors"
	@dragover="handleDragOver"
	@drop="handleDrop"
	@click="fileInput.click()"
>
	<input
		ref="fileInput"
		type="file"
		multiple
		accept="image/*"
		class="hidden"
		@change="uploadFiles"
	/>
	<span class="text-2xl text-zinc-500">+</span>
	<p class="text-sm text-zinc-400 text-center">Drop image<br>for upload</p>
</div>
</template>
