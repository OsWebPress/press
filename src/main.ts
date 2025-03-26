import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Info from './components/Info.vue'
import axios from 'axios'
import { useTokenStore } from './stores/token'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

app.component('Info', Info)

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

export default instance;
