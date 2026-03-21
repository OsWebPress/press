<script setup>
import { myAxios } from '@/axios.ts'
import { ref } from 'vue'
import { UserPlus } from 'lucide-vue-next'

const emit = defineEmits();

const editable = ref('solid');
const username = ref('');
const password = ref('');
const selectedRole = ref('User');

const toggleEdit = () => {
	editable.value = 'edit';
};

const saveUser = async () => {
	// send a request to the instacne backend with the updated info
	try {
		const response = await myAxios.post('admin/user', {username: username.value, password: password.value, role: selectedRole.value});
		emit('addUser');
	} catch (error) {
		console.error("Error posting user", error);
	}
	// if ok set the local vars correctly
	// change to solid
	cancelEdit();

}

const cancelEdit = () => {
	username.value = '';
	password.value = '';
	selectedRole.value = 'User'
	editable.value = 'solid';
}

</script>

<template>
<div>
	<div
		v-if="editable === 'solid'"
		class="border-b border-zinc-700 flex w-full justify-center items-center px-3 py-2 bg-zinc-800 hover:bg-zinc-750 cursor-pointer group transition-colors"
		@click="toggleEdit"
	>
		<UserPlus :size="14" class="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
		<span class="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors ml-2">add user</span>
	</div>

	<div v-if="editable === 'edit'" class="border-b border-zinc-600 flex w-full items-center gap-2 px-3 py-2 bg-zinc-700 text-sm">
		<p class="w-1/12 text-zinc-500">—</p>
		<div class="w-3/12">
			<input v-model="username" placeholder="Username" class="rounded-md bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder-zinc-500 px-2 py-1 outline-none w-full text-sm" />
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
