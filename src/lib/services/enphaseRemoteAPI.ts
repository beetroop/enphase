import { APIInterface } from "./APIInterface";
import env from "dotenv";

env.config();

import {container, httpService} from "../container";
export class enphaseRemoteAPI implements APIInterface {
    baseUrl: string = `https://${process.env.ENPHASE_ENVOY_URN}`;
    httpService: httpService;
    constructor(){
        this.httpService = container.resolve("httpService");
    }
    async ping(): Promise<boolean> {
        try {
            await this.httpService.fetch(`${this.baseUrl}`);
            return true;
        } catch (e) {
            console.log('http service error: ', e);
            return false;
        }
    }
}