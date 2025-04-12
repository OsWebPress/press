<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoadNav from '@/components/LoadNav.vue'
</script>

<template>
	<header class="fixed top-0 left-0 w-full shadow-md z-50">
		<LoadNav />
	</header>
	<div>
		<RouterView />
	</div>

</template>
