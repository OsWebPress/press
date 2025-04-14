<script setup>
import { ref, watch, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import Login from '@/components/Login.vue';
import UserList from '@/components/Userlist.vue';
import LoadNav from '@/components/LoadNav.vue';
import { useTokenStore } from '@/stores/token';

const view = ref('login');
const tokenstore = useTokenStore();
const role = ref(null);

onMounted(() => {
  watch(() => tokenstore.token, (newValue) => {
    if (newValue !== '') {
      view.value = 'authenticated';
      const decodedToken = jwtDecode(newValue);
      role.value = decodedToken.role || null;
    } else {
      view.value = 'login';
    }
  }, { immediate: true });
});
</script>

<template>
	<header>
		<div class="w-full z-50">
			<LoadNav />
		</div>
	</header>

	<div class="w-full h-screen bg-gray-800"></div>
	<div class="absolute top-1/6 left-1/8 bg-black">
		<Login v-if="view === 'login'"/>
		<div v-if="role === 'Admin'" class="w-[800px]">
			<UserList class="w-full"/>
		</div>
	</div>
</template>
