import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
  const token = ref("")
  function overwriteToken(new_token: string) {
	token.value = new_token;
  }

  return { token, overwriteToken }
})
