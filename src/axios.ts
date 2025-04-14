import axios from 'axios'
import { useTokenStore } from './stores/token'
const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
	baseURL: API_URL
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

export const myAxios = instance;