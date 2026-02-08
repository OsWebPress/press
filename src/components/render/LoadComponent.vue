<script setup>
import { onMounted, shallowRef } from 'vue'
import { useComponentsStore } from '@/stores/components';
import { API_URL } from '@/axios';

const importedComponent = shallowRef(null)
const componentsStore = useComponentsStore();

onMounted(() => {
	componentsStore.getComponent(`${API_URL}/component/${props._component}.vue`).then(component => {
		importedComponent.value = component;
	})
})

const props = defineProps({
  _component: {
    type: String,
    required: true
  },
});

</script>

<template>
	<component :is=importedComponent v-bind="$attrs"><slot></slot></component>
</template>