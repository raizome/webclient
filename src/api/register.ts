import client from "@src/api/client";

const REGISTER_ENDPOINT_URL = "/api/v1/register";

export interface IUser {
    name: string;
    email: string;
    password: string;
}

export default function register(user: IUser) {
    return client.post(REGISTER_ENDPOINT_URL, user);
}
