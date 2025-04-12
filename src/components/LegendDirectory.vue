<script setup>

const props = defineProps({
	dir: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits();

function emitFile(page) {
	emit("openFile", page)
}

</script>

<template>
	<div class="px-2">
		<p class="text-red-300">{{props.dir.name}}</p>
		<div class="text-white" v-for="child in props.dir.children">
			<LegendDirectory v-if="child.is_dir" :dir="child" @openFile="emitFile" />
			<button
			v-else
			@click="emitFile(child)"
			class="px-2 border-b border-white border-b-1 cursor-pointer">
			{{child.name}}</button>
		</div>
	</div>
</template>