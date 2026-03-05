import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default client;
