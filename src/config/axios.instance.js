import axios from "axios";
import Config from "./config";
import TokenService from "../services/tokenService";

const baseURL = Config.getBaseUrl();

const axiosInstance = axios.create({
    baseURL,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${TokenService.getToken()}`
    return config;
})

export default axiosInstance;