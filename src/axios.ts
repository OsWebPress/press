import axios from 'axios'
import { useTokenStore } from './stores/token'

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