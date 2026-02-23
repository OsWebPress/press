<script setup>

const emit = defineEmits();
function emitFoldOut() {
	emit("foldOut");
}
</script>

<template>
<div @click="emitFoldOut" class="fixed top-1/8 right-0 border-2 border-gray-600 p-2 text-center bg-gray-200 [writing-mode:vertical-lr] rounded-tl-lg rounded-bl-lg">
	Preview
</div>
</template>