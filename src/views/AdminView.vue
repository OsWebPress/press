<script>
import { ref, watch, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import Login from '@/components/Login.vue';
import UserList from '@/components/Userlist.vue';
import { useTokenStore } from '@/stores/token';

export default {
  components: {
    Login,
    UserList,
  },
  setup() {
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
      });
    });

    return {
      view,
      tokenstore,
	  role,
    };
  },
};
</script>

<template>
	<div class="absolute top-1/6 left-1/8">
		<Login v-if="view === 'login'"/>
		<div v-if="role === 'Admin'" class="w-[800px]">
			<UserList class="w-full"/>
		</div>
  </div>
</template>
