<script setup>
import { ref } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { loadComponent } from 'vue3-external-component'
import { myAxios } from '@/axios.ts'

const importedComponent = shallowRef(null)
const navigationData = ref([])
const loaded = ref(false)

onMounted(async () => {
	const response = await myAxios.get('navigation/data')
	importedComponent.value = await loadComponent('http://localhost:8080/navigation.vue');
	navigationData.value = response.data
	loaded.value = true
})

</script>

<template>
	<component v-if="loaded" :is=importedComponent :navigationData='navigationData'><slot></slot></component>
</template>