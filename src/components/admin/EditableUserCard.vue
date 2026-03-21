<script setup>
import { myAxios } from '@/axios.ts'
import { ref, onMounted } from 'vue'

const editable = ref('solid');
const username = ref('');
const password = ref('');
const selectedRole = ref('');
const cardName = ref('');
const cardRole = ref('');

const toggleEdit = () => {
	editable.value = 'edit';
	username.value = props.user.username;
	selectedRole.value = props.user.role;
};

const saveUser = async () => {
	// send a request to the instacne backend with the updated info
	try {
		const response = await myAxios.post('admin/user', {username: username.value, password: password.value, role: selectedRole.value});
		cardName.value = username;
		cardRole.value = selectedRole;
	} catch (error) {
		console.error("Error posting user", error);
	}
	// if ok set the local vars correctly
	// change to solid
	editable.value = 'solid';

}

const cancelEdit = () => {
	editable.value = 'solid';
}

onMounted(() => {
	cardName.value = props.user.username;
	cardRole.value = props.user.role;
})

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  id: Number
});
</script>

<template>
	<div class="border-b border-zinc-700 flex w-full text-sm" :class="editable === 'edit' ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-750'">
		<div v-if="editable === 'solid'" class="w-full flex flex-row items-center px-3 py-2">
			<p class="w-1/12 text-zinc-500">{{ user.id }}</p>
			<p class="w-6/12 text-zinc-200">{{ cardName }}</p>
			<p class="w-3/12 text-zinc-400">{{ cardRole }}</p>
			<div class="w-2/12 flex justify-end">
				<button @click="toggleEdit" class="px-2 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors">Edit</button>
			</div>
		</div>

		<div v-if="editable === 'edit'" class="w-full flex items-center gap-2 px-3 py-2">
			<p class="w-1/12 text-zinc-500">{{ user.id }}</p>
			<div class="w-3/12">
				<input v-model="username" class="rounded-md bg-zinc-900 border border-zinc-600 text-zinc-100 px-2 py-1 outline-none w-full text-sm" />
			</div>
			<div class="w-3/12">
				<input type="password" v-model="password" placeholder="password" class="rounded-md bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 px-2 py-1 outline-none w-full text-sm" />
			</div>
			<div class="w-2/12">
				<select id="role" v-model="selectedRole" class="bg-zinc-900 border border-zinc-600 text-zinc-100 rounded-md px-2 py-1 outline-none text-sm w-full">
					<option value="Admin">Admin</option>
					<option value="Mod">Mod</option>
					<option value="User">User</option>
				</select>
			</div>
			<div class="flex justify-end gap-2 w-2/12">
				<button @click="cancelEdit" class="px-2 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors text-xs">Cancel</button>
				<button @click="saveUser" class="px-2 py-1 rounded-md bg-teal-700 hover:bg-teal-600 text-white transition-colors text-xs">Save</button>
			</div>
		</div>
	</div>
</template>