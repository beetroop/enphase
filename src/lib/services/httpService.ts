import axios, {AxiosResponse} from "axios";
import * as https from "https";

interface httpServiceInterface {
    fetch: (url: string) => Promise<unknown>;
}
export class httpService {
    constructor() {
    }
    async fetch(url: string): Promise<AxiosResponse> {
        return await axios.get(url);
    }

    async fetchUnsafe(url: string): Promise<AxiosResponse> {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        return await axios.get(url, {httpsAgent: agent});
    }
}