import axios, {AxiosResponse} from "axios";
import * as https from "https";
import {AxiosRequestConfig} from "axios";

export interface IHttpClient {
    get(endpoint: string): Promise<AxiosResponse>;
    post(parameters: IHttpClientRequestParameters): Promise<AxiosResponse>;
}

export type IHttpClientRequestParameters  = {
    endpoint: string,
    body?: object,
    config?: Omit<AxiosRequestConfig, 'url' | 'data'>
}

export class httpClient implements IHttpClient {
    private axiosInstance;
    constructor(configOptions: AxiosRequestConfig){
        this.axiosInstance = axios.create(configOptions);
    }
    public isAuthenticated(): boolean {
        return (this.axiosInstance.defaults.headers.common['Authorization'] !== undefined)
    }
    public addHeader(header: string, value: string): void {
        this.axiosInstance.defaults.headers.common[header] = value;
    }
    async post<AxiosResponse>(params: IHttpClientRequestParameters): Promise<AxiosResponse> {
        return await this.axiosInstance.post(params.endpoint, params.body, params.config);
    }

    async get<AxiosResponse>(endpoint: string): Promise<AxiosResponse> {
        return await this.axiosInstance.get(endpoint);
    }
}

export class httpClientFactory {
    static create(baseURL: URL, headers: object=
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        }
    , rejectUnauthorized: boolean = false, maxRedirects: number = 0): httpClient {
        const configOptions: AxiosRequestConfig = {
            baseURL: baseURL.toString(),
            maxRedirects: maxRedirects,
            headers: headers,
            httpsAgent: new https.Agent({rejectUnauthorized: rejectUnauthorized})
        };
        return new httpClient(configOptions);
    }
}