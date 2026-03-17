import axios from 'axios'
export const API_URL = window.location.origin + "/api";

const instance = axios.create({
	baseURL: API_URL,
	// withCredentials: true
});

import { useUserStore } from './stores/user'

instance.interceptors.response.use(
	res => res,
	err => {
		if (err.response?.status === 401) {
			useUserStore().user = ''
		}
		return Promise.reject(err)
	}
)

export const myAxios = instance;
