/**
 * code used to interact with the /api/v1/get endpoint
 *  https://abdulrahim2002.github.io/open-pocket-docs/docs/API-spec/Endpoints/get/
 * 
 * Here it is compulsary to provide the access token, even though the request can also
 * be authenticated with session cookie. So if you have a valid session cookie, you can
 * just keep the access token blank. But it is still recommended to provide the access token
 */
import client from "@src/api/client";

const GET_ENDPOINT_URL = "/api/v1/get";

interface IGetParams {
    consumer_key: string;
    access_token: string;
    state?: "all" | "unread" | "archive" | "deleted";
    favorited?: "0" | "1";
    tag?: string;
    contentType?: "article" | "video" | "image";
    sort?: "newest" | "oldest" | "title" | "site";
    detailType?: "simple" | "complete";
    search?: string;
    domain?: string;
    since?: string;
    count?: number;
    offset?: number;
    total?: boolean;
}

const getManager = async (request: IGetParams) => {
    const resGetManager = await client.post(GET_ENDPOINT_URL, request);
    return resGetManager;
};

export default getManager;
