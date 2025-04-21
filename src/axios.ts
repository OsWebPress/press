import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
	baseURL: API_URL,
	// withCredentials: true
});

// instance.interceptors.request.use(config => {
// 	  return config;
// 	}, error => {
// 	  return Promise.reject(error);
// });

export const myAxios = instance;