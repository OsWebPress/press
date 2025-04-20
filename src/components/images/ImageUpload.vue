<script setup>
import { myAxios } from '@/axios.ts'

const emit = defineEmits();

// Handles dropped files
const handleDrop = async (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)

	const formData = new FormData()
	files.forEach(file => {
			formData.append('image', file)
	})
	// console.log(formData)

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
    class="border-4 rounded-2xl border-dashed w-full h-full bg-white/50 flex justify-center items-center"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <p>
      Drop image<br>for upload
    </p>
  </div>
</template>
