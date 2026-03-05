/**
 * The code here is used to interact with the /api/v1/add endpoint
 * https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/add/
 * 
 * Again, the access token is required, but we are banking on the fact for now that
 * a session cookie is available.
 * TODO: implement proper access token and refresh token functionality using react
*/
import BACKEND_ENDPOINTS    from "@src/commons/endpoints";
import client               from "@src/api/client";

interface IUrlInfo {
    url: string;
    consumer_key: string;
    access_token: string;
    title?: string;
    tags?: string;
    tweet_id?: string;
}

const addManager = async (UrlInfo: IUrlInfo) => {
    const resAddManager = client.post(BACKEND_ENDPOINTS.add, UrlInfo);
    return resAddManager;
};

export default addManager;
