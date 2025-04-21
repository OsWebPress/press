import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref("")
  function overwriteUser(new_user: string) {
	user.value = new_user;
  }

  return { user, overwriteUser }
})
