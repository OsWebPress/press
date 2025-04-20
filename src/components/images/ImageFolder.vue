<script setup>

function emitDirChange() {
	console.log()
}

</script>

<template>
	<!-- register thsi dis as a drop area (for images). -->
<div class="border-4 border-dashed w-full h-full rounded-2xl">
	<button @click="emitDirChange" class="text-50">📁</button>
</div>
</template>