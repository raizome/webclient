import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 3000,
    withCredentials: true,
});

// data in all post requests shall be sent in JSON
client.defaults.headers.post["Content-Type"] = "application/json";

export default client;
