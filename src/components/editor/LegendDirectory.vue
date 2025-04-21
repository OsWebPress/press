<script setup>
import { ref } from 'vue'
import { myAxios } from '@/axios.ts'

const drop = ref(true)
const addFileInput = ref(false)
const newFileInput = ref('')
const props = defineProps({
	dir: {
		type: Object,
		required: true,
	},
	selected: String
})

const emit = defineEmits();

function createFile() {
	emitCreateFile(props.dir.path + '/' + newFileInput.value)
	changeFileInput()
}

function emitCreateFile(filePath) {
	emit("createFile", filePath);
}

function changeFileInput() {
	addFileInput.value = !addFileInput.value
	newFileInput.value = ''
}

function emitFile(page) {
	emit("openFile", page)
	emit("selectedPath", page)
}

function emitSelected(page) {
	emit("selectedPath", page)
}

function expand() {
	// if we want to remember the state we should add this in the object three instead.
	drop.value = !drop.value;
}

function deleteFile(path) {
	// add popup
	// delete the file from the backend
	myAxios.delete(path)
	emit("deleteFile", path)
	// update the editor
}

function emitDelete(path) {
	emit("deleteFile", path);
}

</script>

<template>
	<div class="pl-2 w-full">
		<div class="flex"
		:class="{'bg-gray-800': selected === props.dir.path}">
			<p @click="emitSelected(props.dir)" class="text-red-300 w-full">{{props.dir.name}}</p>
			<div class="ml-auto pr-2 flex" v-if="selected === props.dir.path">
				<button class="bg-gray-800" v-if="addFileInput" @click="changeFileInput">x</button>
				<button v-else @click="changeFileInput">+</button>
				<button class="ml-auto px-2 text-red-300" @click="deleteFile(props.dir.path)">☠️</button>
			</div>
			<button @click="expand" class="ml-auto pr-2 text-red-300"><div v-if="drop">-</div><div v-else>v</div></button>
		</div>
		<input class="bg-gray-900"
		@keyup.enter="createFile"
		v-model="newFileInput" v-if="addFileInput" />

		<div class="text-white flex w-full overflow-scroll"
			:class="{'bg-gray-800': selected === child.path}"
			v-if="drop" v-for="child in props.dir.children">

			<LegendDirectory v-if="child.is_dir" :dir="child" :selected="props.selected" @openFile="emitFile" @selectedPath="emitSelected" @createFile="emitCreateFile" @deleteFile="emitDelete" />

			<div class="flex" v-else>
				<button
				@click="emitFile(child)"
				class="px-2 border-b border-white border-b-1 cursor-pointer"
				>{{child.name}}</button>
				<button v-if="selected === child.path" class="ml-auto px-2 text-red-300" @click="deleteFile(child.path)">☠️</button>
			</div>
			<!-- <button class="ml-auto pr-2" v-if="child.is_dir === false"><</button> -->
		</div>
	</div>
</template>