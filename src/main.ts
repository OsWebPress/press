import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

export const app = createApp(App)

// Expose Vue globally
// @ts-ignore
window.Vue = app._context.app.constructor

app.use(createPinia())
app.use(router)

app.mount('#app')