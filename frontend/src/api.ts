import axios from "axios";
import Cookies from "js-cookie"

const apiUrl = import.meta.env.VITE_URL;
const apiPort = import.meta.env.VITE_PORT;

export const api = axios.create({
    baseURL: `${apiUrl}:${apiPort}`
})

api.interceptors.request.use(config => { 
    const token = Cookies.get('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
} )