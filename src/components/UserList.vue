<script lang="ts">
	import { myAxios } from '@/main.ts'
	import { ref, onMounted } from 'vue'
	import { useTokenStore } from '@/stores/token'
	import EditableUserCard from '@/components/EditableUserCard.vue'
	import NewUserCard from '@/components/NewUserCard.vue'
	export default {
		components: {
			EditableUserCard,
			NewUserCard,
		},
		setup() {
			const userlist = ref([])

			const getUsers = async () => {
				try {
					const response = await myAxios.get('/admin/users');
					console.log(response);
					userlist.value = response.data; // This correctly updates the reactive ref
				} catch (error) {
					console.error("Error fetching users:", error);
				}
				console.log('getUsers called')
			}

			onMounted(async () => {
				getUsers();
			});

			return { userlist, getUsers }
		},
	};
</script>

<template>
	<div class="rounded-lg p-2 border-2 border-green-200 w-full max-h-128 overflow-y-auto">
		<NewUserCard class="w-full" @addUser="getUsers"/>
		<EditableUserCard v-for="user in userlist" :user :key="user.id" class="w-full"/>
	</div>
</template>