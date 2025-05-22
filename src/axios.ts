import axios from 'axios'
export const API_URL = window.location.origin + "/api";

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