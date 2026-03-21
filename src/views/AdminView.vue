<script setup>
import { ref, watch, onMounted } from 'vue';
import Login from '@/components/Login.vue';
import UserList from '@/components/admin/UserList.vue';
import AdminNav from '@/components/AdminNav.vue';
import { useUserStore } from '@/stores/user';

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
	<div class="min-h-screen flex flex-col bg-zinc-900">
		<div class="w-full z-50">
			<AdminNav />
		</div>
		<div class="flex-1 flex items-start justify-center pt-16 px-8">
			<Login v-if="view === 'login'" />
			<div v-if="role === 'Admin'" class="w-[800px]">
				<UserList class="w-full" />
			</div>
		</div>
	</div>
</template>
