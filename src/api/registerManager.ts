import client               from "@src/api/client";
import BACKEND_ENDPOINTS    from "@src/commons/endpoints";

interface IUser {
    name: string;
    email: string;
    password: string;
}

const registerManager = async (user: IUser) => {
    // TODO: wrap in QueryClient and handle errors
    const resRegisterManager = await client.post(BACKEND_ENDPOINTS.register, user);
    return resRegisterManager;
};

export type { IUser };
export default registerManager;
