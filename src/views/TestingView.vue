<script setup>
import { ref } from 'vue'
import LoadComponent from '@/components/LoadComponent.vue'

const component = ref('');
const activate = ref(false)

function goActive() {
	activate.value = true
}

// const ImportedComponent = loadComponent(`http://localhost:8080/carbon/components/${component.value}.vue`);
</script>

<template>
	<div>
		<button @click=goActive>activate</button>
		<input v-model="component" class="rounded-sm bg-green-100 text-black px-1" />
	</div>
	<div>
		<LoadComponent v-if='activate' :component="component">slot</LoadComponent>
		<!-- <ImportedComponent>very Yellow!</ImportedComponent> -->
	</div>
</template>