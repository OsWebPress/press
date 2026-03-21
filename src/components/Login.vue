<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { myAxios } from '@/axios.ts';

const username = ref('');
const password = ref('');
const store = useUserStore();

const handleLogin = async () => {
    try {
        const response = await myAxios.post('login',
            { username: username.value, password: password.value },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        store.user = response.data.role;
    } catch (error) {
        console.error("Login failed:", error);
        //  Handle error (e.g., show message to user)
    }
};

onMounted(async () => {
    try {
        const response = await myAxios.post('login',
            { username: username.value, password: password.value },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        store.user = response.data.role;
    } catch (error) {
        console.error("Login failed:", error);
        //  Handle error (e.g., show message to user)
    }
})

</script>

<template>
	<div class="rounded-xl bg-zinc-800 border border-zinc-700 p-6 w-80 flex flex-col gap-3">
		<p class="text-zinc-300 text-sm font-medium mb-1">Admin Login</p>

		<input
			v-model="username"
			placeholder="username"
			class="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors w-full"
		/>
		<input
			@keyup.enter="handleLogin"
			type="password"
			v-model="password"
			placeholder="password"
			class="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors w-full"
		/>
		<button
			class="rounded-lg bg-zinc-600 hover:bg-zinc-500 text-zinc-100 text-sm px-4 py-2 transition-colors w-full"
			@click="handleLogin"
		>Login</button>
	</div>
</template>