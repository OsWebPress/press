<script>
	import Login from '@/components/Login.vue'
	import { useTokenStore } from '@/stores/token'
	import { watch } from 'vue';
	import UserList from '@/components/Userlist.vue'

	export default {
		components: {
			Login, // Register the component
			UserList,
		},
		data() {
			return {
			view: 'login',
			};
		},
		mounted() {
			const tokenstore = useTokenStore();

			watch(() => tokenstore.token, (newValue) => {
			if (newValue !== '') {
				this.view = 'authenticated';
			}
			});

			return { tokenstore };
		},
	};
</script>

<template>
	<Login v-if="view === 'login'"/>
	<div v-if="view === 'authenticated'">
		<h1>authenticated</h1>
		<UserList />

	</div>
</template>
