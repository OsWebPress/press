<script setup>
import { onMounted, shallowRef } from 'vue'
import { loadComponent } from 'vue3-external-component'

const importedComponent = shallowRef(null)



onMounted(() => {
	importedComponent.value = loadComponent(`http://localhost:8080/component/${props.component}.vue`);
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