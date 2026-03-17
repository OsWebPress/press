<script setup>
import { ref, watch, computed } from 'vue'
import { myAxios } from '@/axios.ts'
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, FileCode2, FileJson, File, Trash2, Plus, X } from 'lucide-vue-next'

function fileIcon(name) {
	const ext = name.split('.').pop()
	if (ext === 'vue') return { icon: FileCode2, color: 'text-green-400' }
	if (ext === 'md') return { icon: FileText, color: 'text-blue-400' }
	if (ext === 'json') return { icon: FileJson, color: 'text-orange-400' }
	return { icon: File, color: 'text-zinc-500' }
}

const addFileInput = ref(false)
const newFileInput = ref('')
const props = defineProps({
	dir: {
		type: Object,
		required: true,
	},
	selected: String
})

const drop = ref(false)
watch(() => props.dir.name, (name) => {
	if (name === 'root' || name === 'carbon') drop.value = true
}, { immediate: true })

const sortedChildren = computed(() => {
	if (!props.dir.children) return [];
	return [...props.dir.children].sort((a, b) => {
		if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
});

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
	drop.value = !drop.value;
}

function deleteFile(path) {
	myAxios.delete(path)
	emit("deleteFile", path)
}

function emitDelete(path) {
	emit("deleteFile", path);
}

</script>

<template>
	<div class="w-full select-none">

		<!-- Folder row -->
		<div class="group flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-zinc-800"
			:class="selected === props.dir.path ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'">

			<button @click="expand" class="flex-shrink-0 text-zinc-600 hover:text-zinc-300">
				<ChevronDown v-if="drop" :size="13" />
				<ChevronRight v-else :size="13" />
			</button>

			<component :is="drop ? FolderOpen : Folder" :size="14" class="flex-shrink-0 text-zinc-100" />

			<span @click="expand(); emitSelected(props.dir)" class="flex-grow text-sm truncate">
				{{ props.dir.name }}
			</span>

			<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
				<button v-if="addFileInput" @click="changeFileInput"
					class="text-zinc-500 hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-700">
					<X :size="12" />
				</button>
				<button v-else @click="changeFileInput"
					class="text-zinc-500 hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-700">
					<Plus :size="12" />
				</button>
				<button @click="deleteFile(props.dir.path)"
					class="text-zinc-600 hover:text-red-400 p-0.5 rounded hover:bg-zinc-700">
					<Trash2 :size="12" />
				</button>
			</div>
		</div>

		<!-- New file input -->
		<input v-if="addFileInput"
			v-model="newFileInput"
			@keyup.enter="createFile"
			placeholder="filename.md"
			class="w-full mt-0.5 px-3 py-0.5 text-sm bg-zinc-800 border border-zinc-600 text-zinc-200 rounded outline-none focus:border-zinc-500 placeholder-zinc-600" />

		<!-- Children -->
		<div v-if="drop" class="pl-3">
			<div v-for="child in sortedChildren" :key="child.path">

				<LegendDirectory v-if="child.is_dir"
					:dir="child"
					:selected="props.selected"
					@openFile="emitFile"
					@selectedPath="emitSelected"
					@createFile="emitCreateFile"
					@deleteFile="emitDelete" />

				<div v-else
					class="group flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-zinc-800"
					:class="selected === child.path ? 'bg-zinc-800' : ''">

					<component :is="fileIcon(child.name).icon" :size="13" class="flex-shrink-0" :class="fileIcon(child.name).color" />

					<button @click="emitFile(child)"
						class="flex-grow text-left text-sm truncate"
						:class="selected === child.path ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'">
						{{ child.name }}
					</button>

					<button @click="deleteFile(child.path)"
						class="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 p-0.5 rounded hover:bg-zinc-700 flex-shrink-0">
						<Trash2 :size="12" />
					</button>
				</div>

			</div>
		</div>

	</div>
</template>
