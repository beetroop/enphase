import {httpService} from "../container";
export interface APIInterface {
    baseUrl: string;
    httpService: httpService;
}