import { APIInterface } from "./APIInterface";
import env from "dotenv";

env.config();

import {container, httpService} from "../container";
export class enphaseLocalAPI implements APIInterface {
    baseUrl: string = `http://${process.env.ENPHASE_ENVOY_URN}:${process.env.ENPHASE_ENVOY_PORT}`;
    httpService: httpService;
    constructor(){
        this.httpService = container.resolve("httpService");
    }
    async ping(): Promise<boolean> {
        try {
            await this.httpService.fetchUnsafe(`${this.baseUrl}`);
            return true;
        } catch (e) {
            console.log('http service error: ', e);
            return false;
        }
    }
}