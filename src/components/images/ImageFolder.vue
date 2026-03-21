<script setup>
import { Folder } from 'lucide-vue-next'
defineProps({ name: String, compact: Boolean })
const emit = defineEmits(['select'])
</script>

<template>
<!-- compact: small horizontal pill -->
<div
	v-if="compact"
	@click="emit('select')"
	class="border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer h-10 px-3 rounded-lg flex items-center gap-2 transition-colors"
>
	<Folder :size="14" class="text-zinc-400 flex-shrink-0" />
	<span class="text-sm text-zinc-300 whitespace-nowrap">{{ name }}</span>
</div>

<!-- default: full card -->
<div
	v-else
	@click="emit('select')"
	class="border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors"
>
	<Folder :size="36" class="text-zinc-400" />
	<span class="text-sm text-zinc-300 truncate max-w-full px-4">{{ name }}</span>
</div>
</template>
