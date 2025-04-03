<script setup>
import { myAxios } from '@/main.ts'
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
		const response = await myAxios.post('/admin/user', {username: username.value, password: password.value, role: selectedRole.value});
		cardName.value = username;
		cardRole.value = selectedRole;
		console.log(response.data);
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
	<div class="rounded-lg py-2 border-2 border-green-100 flex w-full">
		<div v-if="editable === 'solid'" class="w-full flex flex-row justify-between">
			<p class="w-1/12 px-2">{{ user.id }} </p>
			<p class="w-6/12">{{ cardName }} </p>
			<p class="w-3/12">{{ cardRole }}  </p>
			<div class="px-2 w-2/12 flex justify-end"><button @click="toggleEdit" class="px-2 rounded-lg bg-amber-600">Edit</button></div>
		</div>

		<div v-if="editable === 'edit'" class="w-full flex mx-2 justify-between">
			<p class="w-1/12 px-2">{{ user.id }}</p>
			<div class="w-3/12">
				<input v-model="username" class="rounded-sm bg-green-100 text-black px-1" />
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
</template>