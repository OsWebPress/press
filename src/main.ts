import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useTokenStore } from './stores/token'

export const app = createApp(App)

// Expose Vue globally
// @ts-ignore
window.Vue = app._context.app.constructor

app.use(createPinia())
app.use(router)

app.mount('#app')

axios.defaults.baseURL = 'http://localhost:8080'; // hardcoded dev env.

const instance = axios.create({
	baseURL: 'https://api.example.com'
});

instance.interceptors.request.use(config => {
	const tokenstore = useTokenStore();
	if (tokenstore.token) {
		config.headers.Authorization = `${tokenstore.token}`;
	  }
	  return config;
	}, error => {
	  return Promise.reject(error);
});

instance.defaults.baseURL = 'http://localhost:8080';

export const myAxios = instance;
