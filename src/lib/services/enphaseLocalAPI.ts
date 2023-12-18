import { type APIInterface } from './APIInterface'
import { type HttpClient, httpClientFactory } from '../container'
import { type AxiosResponse } from 'axios'
import { type Measurements, type Reading } from './enphaseDataTypes'
import * as crypto from 'crypto'

export class enphaseLocalAPI implements APIInterface {
  baseURL: string = `https://${process.env.ENPHASE_ENVOY_URN}`
  authURL: string = `https://${process.env.ENPHASE_AUTH_URN}`
  httpClient: HttpClient
  authHttpClient: HttpClient
  private _productionJSONData: Measurements | undefined = undefined
  constructor () {
    this.httpClient = httpClientFactory.create(new URL(this.baseURL))
    this.authHttpClient = httpClientFactory.create(new URL(this.authURL))
  }

  public async authenticate (): Promise<void> {
    const codeVerifier = this.generateCodeVerifier()
    console.log('code verifier generated...')
    const codeChallenge = this.generateCodeChallenge(codeVerifier)
    console.log('code challenge generated...')
    const code = await this.getCode(codeChallenge)
    console.log('code retrieved...')
    const jwt = await this.getJWT(code, codeVerifier)
    console.log('jwt retrieved...')
    this.httpClient.addHeader('Authorization', `Bearer ${jwt}`)
    console.log('jwt added to client...')
  }

  async getProductionJSONData (): Promise<Measurements> {
    if (this._productionJSONData != null && this._productionJSONData.production[0].readingTime > Date.now() - 5000) return this._productionJSONData
    this._productionJSONData = await this.fetchData<Measurements>('production')
    return this._productionJSONData
  }

  async netConsumption (): Promise<Reading> {
    const data: Measurements = await this.getProductionJSONData()
    return data.consumption.filter(reading => reading.measurementType === 'net-consumption')[0]
  }

  async totalConsumption (): Promise<Reading> {
    const data: Measurements = await this.getProductionJSONData()
    return data.consumption.filter(reading => reading.measurementType === 'total-consumption')[0]
  }

  async production (): Promise<Reading> {
    const data: Measurements = await this.getProductionJSONData()
    return data.production.filter(reading => reading.measurementType === 'production')[0]
  }

  generateCodeVerifier (): string {
    return crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  generateCodeChallenge (codeVerifier: string): string {
    const sha = crypto.createHash('sha256').update(codeVerifier).digest()
    return Buffer.from(sha).toString('base64url')
  }

  async fetchData<T> (endPoint: string): Promise<T> {
    if (!this.httpClient.isAuthenticated()) await this.authenticate()
    const res: AxiosResponse<T> = await this.httpClient.get(endPoint)
    if (res.data === undefined) throw new Error('Unable to get data')
    return res.data
  }

  async getCode (codeChallenge: string): Promise<string> {
    const response: AxiosResponse = await this.authHttpClient.post(
      {
        endpoint: '/login',
        body: {
          username: process.env.ENPHASE_USERNAME,
          password: process.env.ENPHASE_PASSWORD,
          codeChallenge,
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
    )
    const loginRedirectLocation = new URL(response.headers.location as string)
    const loginRedirectParams = loginRedirectLocation.searchParams
    const code = loginRedirectParams.get('code')
    if (code == null) throw new Error('Unable to get code')
    return code
  }

  async getJWT (code: string, codeVerifier: string): Promise<string> {
    const response: AxiosResponse = await this.authHttpClient.post(
      {
        endpoint: '/oauth/token',
        body:
                {
                  client_id: 'envoy-ui-1',
                  code,
                  code_verifier: codeVerifier,
                  grant_type: 'authorization_code',
                  redirect_uri: '/auth/callback'
                }
      }
    )
    return response.data.access_token
  }
}
