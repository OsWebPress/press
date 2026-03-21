<script lang="ts">
	import { myAxios } from '@/axios.ts'
	import { ref, onMounted } from 'vue'
	import EditableUserCard from '@/components/admin/EditableUserCard.vue'
	import NewUserCard from '@/components/admin/NewUserCard.vue'
	export default {
		components: {
			EditableUserCard,
			NewUserCard,
		},
		setup() {
			const userlist = ref([])

			const getUsers = async () => {
				try {
					const response = await myAxios.get('admin/users');
					userlist.value = response.data; // This correctly updates the reactive ref
				} catch (error) {
					console.error("Error fetching users:", error);
				}
			}

			onMounted(async () => {
				getUsers();
			});

			return { userlist, getUsers }
		},
	};
</script>

<template>
	<div class="rounded-xl bg-zinc-800 border border-zinc-700 w-full max-h-128 overflow-y-auto">
		<NewUserCard class="w-full" @addUser="getUsers"/>
		<EditableUserCard v-for="user in userlist" :user :key="user.id" class="w-full"/>
	</div>
</template>