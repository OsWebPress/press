<script setup>
import { ref, watch, onMounted } from 'vue';
import Login from '@/components/Login.vue';
import UserList from '@/components/admin/UserList.vue';
import LoadNav from '@/components/LoadNav.vue';
import { useUserStore } from '@/stores/user';
import navData from '@/assets/adminNavigation.json'

const view = ref('login');
const store = useUserStore();
const role = ref(null);

onMounted(() => {
  watch(() => store.user, (newValue) => {
    if (newValue !== "") {
      view.value = 'authenticated';
      role.value = newValue;
    } else {
      view.value = 'login';
    }
  }, { immediate: true });
});
</script>

<template>
	<title>Admin Control</title>
	<header>
		<div class="w-full z-50">
			<LoadNav :navData />
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
