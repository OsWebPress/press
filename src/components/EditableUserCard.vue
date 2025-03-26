<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
});
// add funciton here which will chang ea value to editor and then we need to call that with edit buton
// this should give the same user wbut the data is in input fields prefilled with the current data, the edit button now is a save button.
</script>

<template>
	<div class="rounded-lg p-2 border-2 border-green-100 flex">
			<p class="text-white">{{ user.id }} | {{ user.username }} | {{ user.role }}  </p>
			<div class="px-2"><button class="mx-4 px-2 rounded-lg bg-amber-600">Edit</button></div>
	</div>
</template>