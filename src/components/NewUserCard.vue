<script setup>
import { myAxios } from '@/main.ts'
import { ref, onMounted } from 'vue'

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
		const response = await myAxios.post('/admin/user', {username: username.value, password: password.value, role: selectedRole.value});
		console.log(response.data);
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
	class="group rounded-lg py-2 border-2 border-green-100 flex w-full hover:border-green-300 justify-center"
	@click="toggleEdit">
		<p class="text-green-100">➕</p>
	</div>


	<div v-if="editable === 'edit'" class="group rounded-lg py-2 border-2 border-green-100 flex w-full">
		<div class="w-full flex mx-2 justify-between">
			<p class="w-1/12 px-2">x</p>
			<div class="w-3/12">
				<input v-model="username" placeholder="Username" class="rounded-sm bg-green-100 text-black px-1" />
			</div>
			<div class="w-3/12">
				<input type="password" v-model="password" placeholder="password" class="rounded-sm px-1 bg-green-100 text-black"/>
			</div>
			<div class="text-white w-3/12">
				<select id="role" v-model="selectedRole" class="text-white">
					<option value="Admin">Admin</option>
					<option value="Mod">Mod</option>
					<option value="User">User</option>
				</select>
			</div>
			<div class="flex justify-end w-2/12 px-2">
				<div class="pr-2"><button @click="cancelEdit">❌</button></div>
				<button @click="saveUser" class="px-2 rounded-lg bg-teal-600 text-white">Save</button>
			</div>
		</div>
	</div>
</div>
</template>
