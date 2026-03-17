import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import LoadComponent from './components/render/LoadComponent.vue'
import Makedown from './components/render/Makedown.vue'

export const app = createApp(App)

// Expose Vue globally
// @ts-ignore
window.Vue = app._context.app.constructor

app.use(createPinia())
app.use(router)

app.component('LoadComponent', LoadComponent)
app.component('Makedown', Makedown)

app.mount('#app')