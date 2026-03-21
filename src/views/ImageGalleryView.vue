<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { myAxios } from '@/axios.ts';
import { FolderPlus } from 'lucide-vue-next'
import AdminNav from '@/components/AdminNav.vue'
import Image from '@/components/images/Image.vue'
import ImageUpload from '@/components/images/ImageUpload.vue'
import ImageFolder from '@/components/images/ImageFolder.vue'
import Login from '@/components/Login.vue'
import { useUserStore } from '@/stores/user'

const store = useUserStore()
const login = ref(false)
const filesJson = ref({})
const navStack = ref([])

const currentNode = computed(() => {
	return navStack.value.length > 0
		? navStack.value[navStack.value.length - 1]
		: filesJson.value
})

const currentFolderPath = computed(() => {
	if (navStack.value.length === 0) return ''
	return currentNode.value.path.replace(/^images\//, '')
})

const visibleItems = computed(() => {
	return (currentNode.value?.children ?? [])
		.filter(i => i.is_dir || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(i.name))
})

const folders = computed(() => visibleItems.value.filter(i => i.is_dir))
const images = computed(() => visibleItems.value.filter(i => !i.is_dir))

const creatingFolder = ref(false)
const newFolderName = ref('')
const newFolderInput = ref(null)

async function startCreateFolder() {
	creatingFolder.value = true
	newFolderName.value = ''
	await nextTick()
	newFolderInput.value?.focus()
}

async function confirmCreateFolder() {
	const name = newFolderName.value.trim()
	if (!name) { creatingFolder.value = false; return }
	const tail = currentFolderPath.value ? `${currentFolderPath.value}/${name}` : name
	await myAxios.post(`images/mkdir/${tail}`)
	creatingFolder.value = false
	await handleUploaded()
}

function cancelCreateFolder() {
	creatingFolder.value = false
}

function enterFolder(folderNode) {
	navStack.value.push(folderNode)
}

function navigateTo(index) {
	navStack.value = navStack.value.slice(0, index + 1)
}

async function handleUploaded() {
	const response = await myAxios.get('ronly/images')
	filesJson.value = response.data;
}

onMounted(async () => {
	const response = await myAxios.get('ronly/images')
	filesJson.value = response.data;

	watch(() => store.user, (newValue) => {
		login.value = newValue === '';
	}, { immediate: true });
})
</script>

<template>
	<title>Image Gallery</title>
	<Login class="absolute top-1/4 left-1/6 z-50" v-if="login" />
	<div class="min-h-screen flex flex-col bg-zinc-900">
		<div class="w-full z-50">
			<AdminNav />
		</div>

		<div class="flex items-center gap-1 px-8 pt-6 text-sm text-zinc-400">
			<button @click="navigateTo(-1)" class="hover:text-zinc-100 transition-colors">images</button>
			<template v-for="(node, i) in navStack" :key="node.path">
				<span class="text-zinc-600">/</span>
				<button @click="navigateTo(i)" class="hover:text-zinc-100 transition-colors">{{ node.name }}</button>
			</template>
		</div>

		<div class="flex flex-wrap gap-2 px-8 pt-4">
			<ImageFolder v-for="item in folders" :key="item.path" :name="item.name" compact @select="enterFolder(item)" />

			<template v-if="creatingFolder">
				<input
					ref="newFolderInput"
					v-model="newFolderName"
					type="text"
					placeholder="folder name"
					class="h-10 px-3 rounded-lg bg-zinc-800 border border-zinc-500 text-sm text-zinc-100 outline-none w-36"
					@keyup.enter="confirmCreateFolder"
					@keyup.esc="cancelCreateFolder"
					@blur="cancelCreateFolder"
				/>
			</template>
			<button v-else @click="startCreateFolder" class="h-10 px-3 rounded-lg border border-dashed border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2">
				<FolderPlus :size="14" class="flex-shrink-0" /> new folder
			</button>
		</div>

		<div class="grid grid-cols-6 gap-4 p-8" style="grid-auto-rows: 180px;">
			<ImageUpload :folder="currentFolderPath" @uploadSucces="handleUploaded" />
			<div v-for="item in images" :key="item.path" class="rounded-2xl">
				<Image :imageUrl="item.path" />
			</div>
		</div>
	</div>
</template>
