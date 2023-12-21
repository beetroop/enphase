import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import * as https from 'https'

export interface IHttpClient {
  get: (endpoint: string) => Promise<AxiosResponse>
  post: (parameters: IHttpClientRequestParameters) => Promise<AxiosResponse>
}

export interface IHttpClientRequestParameters {
  endpoint: string
  body?: object
  config?: Omit<AxiosRequestConfig, 'url' | 'data'>
}

export class HttpClient implements IHttpClient {
  private readonly axiosInstance
  constructor (configOptions: AxiosRequestConfig) {
    this.axiosInstance = axios.create(configOptions)
  }

  public isAuthenticated (): boolean {
    return (this.axiosInstance.defaults.headers.common.Authorization !== undefined)
  }

  public addHeader (header: string, value: string): void {
    this.axiosInstance.defaults.headers.common[header] = value
  }

  async post<AxiosResponse>(params: IHttpClientRequestParameters): Promise<AxiosResponse> {
    return await this.axiosInstance.post(params.endpoint, params.body, params.config)
  }

  async get<AxiosResponse>(endpoint: string): Promise<AxiosResponse> {
    return await this.axiosInstance.get(endpoint)
  }

  async getStream<AxiosResponse>(endpoint: string): Promise<AxiosResponse> {
    return await this.axiosInstance.get(endpoint, { responseType: 'stream' })
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class httpClientFactory {
  static create (baseURL: URL, headers: object =
  {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json'
  }
  , rejectUnauthorized: boolean = false, maxRedirects: number = 0): HttpClient {
    const configOptions: AxiosRequestConfig = {
      baseURL: baseURL.toString(),
      maxRedirects,
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized })
    }
    return new HttpClient(configOptions)
  }

  constructor () {
    throw new Error('Cannot instantiate httpClientFactory')
  }
}
