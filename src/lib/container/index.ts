import { container } from 'tsyringe'
import { HttpClient, httpClientFactory } from '../services/httpClient'
import { enphaseLocalAPI } from '../services/enphaseLocalAPI'

container.registerSingleton('enphaseLocalAPI', enphaseLocalAPI)

export { container, httpClientFactory, HttpClient, enphaseLocalAPI }
