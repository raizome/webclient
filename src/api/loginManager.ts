import client            from "@src/api/client";
import BACKEND_ENDPOINTS from "@src/commons/endpoints";

interface ILoginInfo {
    email: string,
    password: string,
}

const loginManager = async (loginInfo: ILoginInfo) => {
    const resLoginManager = await client.post(BACKEND_ENDPOINTS.login, loginInfo);
    return resLoginManager;
};

export default loginManager;
