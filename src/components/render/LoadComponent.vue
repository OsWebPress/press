<script setup>
import { onMounted, shallowRef } from 'vue'
import { loadComponent } from 'vue3-external-component'
const API_URL = import.meta.env.VITE_API_URL;

const importedComponent = shallowRef(null)



onMounted(() => {
	importedComponent.value = loadComponent(`${API_URL}/component/${props.component}.vue`);
})

const props = defineProps({
  component: {
    type: String,
    required: true
  }
});

</script>

<template>
	<div>
		<component :is=importedComponent><slot></slot></component>
	</div>
</template>