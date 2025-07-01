import axios from "axios";
import Cookies from "js-cookie"

export const api = axios.create({
    baseURL: 'http://192.168.0.49:3000'
}) 

api.interceptors.request.use(config => { 
    const token = Cookies.get('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
} )