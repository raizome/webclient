import client from "@src/api/client";

const REGISTER_ENDPOINT_URL = "/api/v1/register";

interface IUser {
    name: string;
    email: string;
    password: string;
}

const registerManager = async (user: IUser) => {
    // TODO: wrap in QueryClient and handle errors
    const resRegisterManager = await client.post(REGISTER_ENDPOINT_URL, user);
    return resRegisterManager;
};

export type { IUser };
export default registerManager;
