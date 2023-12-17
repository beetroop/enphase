import { APIInterface } from "./APIInterface";
import { httpClient, httpClientFactory} from "../container";
import * as crypto from 'node:crypto'
import {AxiosResponse} from "axios";
export class enphaseLocalAPI implements APIInterface {
    baseURL: string = `https://${process.env.ENPHASE_ENVOY_URN}`;
    authURL: string = `https://${process.env.ENPHASE_AUTH_URN}`;
    httpClient: httpClient
    authHttpClient: httpClient;
    constructor(){
        this.httpClient = httpClientFactory.create(new URL(this.baseURL));
        this.authHttpClient = httpClientFactory.create(new URL(this.authURL));
    }

    public async authenticate(){
        const codeVerifier = this.generateCodeVerifier();
        console.log('code verifier generated...')
        const codeChallenge = this.generateCodeChallenge(codeVerifier);
        console.log('code challenge generated...')
        const code = await this.get_code(codeChallenge);
        console.log('code retrieved...')
        const jwt = await this.get_jwt(code, codeVerifier);
        console.log('jwt retrieved...')
        this.httpClient.addHeader('Authorization', `Bearer ${jwt}`);
        console.log('jwt added to client...')
    }

    private generateCodeVerifier(): string {
        return crypto
            .randomBytes(32)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    private generateCodeChallenge(code_verifier: string): string {
        const sha = crypto.createHash('sha256').update(code_verifier).digest();
        return Buffer.from(sha).toString('base64url');
    }
    public async getLocalData(endPoint: string): Promise<AxiosResponse> {
        if (! this.httpClient.isAuthenticated()) await this.authenticate();
        const res: AxiosResponse = await this.httpClient.get(endPoint);
        return res.data;
    }
    private async get_code(codeChallenge: string): Promise<string> {
            const response: AxiosResponse = await this.authHttpClient.post(
                {
                    endpoint: '/login',
                    body: {
                        username: process.env.ENPHASE_USERNAME,
                        password: process.env.ENPHASE_PASSWORD,
                        codeChallenge: codeChallenge,
                        redirectUri: `${this.baseURL}/auth/callback`,
                        client: 'envoy-ui',
                        clientId: 'envoy-ui-client',
                        authFlow: 'oauth',
                        serialNum: process.env.ENVOY_SERIAL_NUMBER,
                        grantType: 'authorize',
                        state: '',
                        invalidSerialNum: ''
                    },
                    config:
                        {
                            validateStatus: status => status === 302
                        }
                }
            );

            const loginRedirectLocation = new URL(response.headers['location']);
            const loginRedirectParams = loginRedirectLocation.searchParams;
            const code = loginRedirectParams.get('code');
            if (!code) throw new Error('Unable to get code');
            return code;
    }

    private async get_jwt(code: string, codeVerifier: string): Promise<string> {
        const response: AxiosResponse = await this.authHttpClient.post(
            {endpoint: `/oauth/token`,
            body:
                {client_id: 'envoy-ui-1',
                code,
                code_verifier: codeVerifier,
                grant_type: 'authorization_code',
                redirect_uri: `/auth/callback`,
                },
            }
        );
        return response.data.access_token;
    }
}