<script lang="ts">
	import axios from 'axios';
	import instance from '@/main.ts'
	import { ref, onMounted } from 'vue'
	import { useTokenStore } from '@/stores/token'
	import EditableUserCard from '@/components/EditableUserCard.vue'
	export default {
		components: {
			EditableUserCard,
		},
		setup() {
			const userlist = ref()

			onMounted(async () => {
				try {
					const response = await instance.get('/admin/users');
					console.log(response);
					userlist.value = response.data; // This correctly updates the reactive ref
				} catch (error) {
					console.error("Error fetching users:", error);
				}
			});

			return { userlist }
		},
	};
</script>

<template>
	<div class="rounded-lg p-2 border-2 border-green-200">
		<EditableUserCard v-for="user in userlist" :user/>
	</div>
</template>