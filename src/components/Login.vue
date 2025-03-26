<script lang="ts">
	import { useTokenStore } from '@/stores/token'
	import axios from 'axios';
	export default {
		data() {
		return {
			username: "",
			password: "",
		};
		},
		methods: {
		async handleLogin() {
			const response = await axios.post('/login',
				{username: this.username, password: this.password},
				{headers: { 'Content-Type': 'application/json' },
				responseType: 'text',}
				);
			const store = useTokenStore();
			store.token = response.data;
		},
		},
	};
</script>

<template>
	<div class="rounded-lg p-2 border-2 border-green-200">

		<div class="p-1 rounded-lg border border-green-100">
			<input v-model="username" placeholder="username" class="placeholder-green-100"/>
		</div>
		<div class="p-1 rounded-lg border border-green-100">
			<input type="password" v-model="password" placeholder="password" class="placeholder-green-100"/>
		</div>
		<div><button class="rounded-lg bg-green-400 p-3" @click="handleLogin">Login</button></div>

	</div>
</template>