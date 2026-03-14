<script setup>
import { ref } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { myAxios, API_URL } from '@/axios.ts'
import { useComponentsStore } from '@/stores/components'

const importedComponent = shallowRef(null)
const navigationData = ref([])
const loaded = ref(false)
const componentsStore = useComponentsStore()

onMounted(async () => {
	if (props.navData === undefined) {
		const response = await myAxios.get('navigation/navigation.json');
		navigationData.value = response.data
	} else {
		navigationData.value = props.navData
	}
	importedComponent.value = await componentsStore.getComponent(`${API_URL}/navigation/active.vue`);

	loaded.value = true;
})

const props = defineProps({
	navData: {
		type: Array,
		required: false,
	},
	path: {
		type: String,
		required: false,
	},
})

</script>

<template>
	<component v-if="loaded" :is=importedComponent :navigationData="navigationData" :path="props.path"><slot></slot></component>
</template>