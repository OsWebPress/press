import { myAxios } from '@/axios.ts'


const loadConfig = await myAxios.get('config.json');
export const config = loadConfig;