<script setup>
import { ref } from 'vue'
import { myAxios } from '@/axios.ts'

const showFilePicker = ref(false);
const emit = defineEmits();

function triggerFilePicker() {
	showFilePicker.value = !showFilePicker.value
}

// not used on drag and drop
function uploadFiles(event) {
	const files = Array.from(event.target.files)
	handleFiles(files)

}

// Handles dropped files
const handleDrop = async (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)

	handleFiles(files)
}

const handleFiles = async (files) => {
	const formData = new FormData()
	files.forEach(file => {
			formData.append('image', file)
	})

	try {
		const response = await myAxios.post('images/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
		})
		emit("uploadSucces");
	} catch (err) {
		console.error('Upload error:', err)
	}
}

const handleDragOver = (event) => {
  event.preventDefault()
}
</script>

<template>
  <div
    class="border-4 rounded-2xl border-dashed w-full h-full bg-white/50 flex flex-col"
    @dragover="handleDragOver"
    @drop="handleDrop"
	@click="triggerFilePicker"
  >
		<input
		class="px-2 w-full border-black bg-gray-500 h-1/6"
		ref="fileInput"
		type="file"
		multiple
		accept="image/*"
		@change="uploadFiles"
		>
		</input>
		<div class="flex justify-center items-center h-full">
			<p class="text-center">
				Drop image<br>for upload
			</p>
		</div>
      <!-- accept="image/*" -->
  </div>
</template>
