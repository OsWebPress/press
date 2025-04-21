<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { myAxios } from '@/axios.ts';

const username = ref('');
const password = ref('');
const store = useUserStore();

const handleLogin = async () => {
    try {
        const response = await myAxios.post('/login',
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
        const response = await myAxios.post('/login',
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
	<div class="rounded-lg p-2 border-2 border-green-200 bg-black">

		<div class="p-1 rounded-lg border-2 border-green-100 bg-slate-600">
			<input v-model="username" placeholder="username" class="placeholder-green-100"/>
		</div>
		<div class="p-1 rounded-lg border-2 border-green-100 bg-slate-600">
			<input
			@keyup.enter="handleLogin"
			type="password" v-model="password" placeholder="password" class="placeholder-green-100"/>
		</div>
		<div><button class="rounded-lg bg-green-400 p-3" @click="handleLogin">Login</button></div>

	</div>
</template>