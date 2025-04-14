<script setup>
import { ref } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { loadComponent } from 'vue3-external-component'
import { myAxios } from '@/axios.ts'
const API_URL = import.meta.env.VITE_API_URL;

const importedComponent = shallowRef(null)
const navigationData = ref([])
const loaded = ref(false)

onMounted(async () => {
	if (props.navData === undefined) {
		const response = await myAxios.get('navigation/data');
		navigationData.value = response.data
	} else {
		navigationData.value = props.navData
	}
	importedComponent.value = await loadComponent(`${API_URL}/navigation.vue`);
	loaded.value = true;
})

const props = defineProps({
	navData: {
		type: Array,
		required: false,
	}
})

</script>

<template>
	<component v-if="loaded" :is=importedComponent :navigationData="navigationData"><slot></slot></component>
</template>