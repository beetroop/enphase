import { container } from 'tsyringe'
import { HttpClient, httpClientFactory } from '../services/httpClient'
import { enphaseLocalAPI } from '../services/enphaseLocalAPI'
import { storeService } from '../services/storeService'

container.register('enphaseLocalAPI', enphaseLocalAPI)
container.register('storeService', storeService)

export { container, httpClientFactory, HttpClient, enphaseLocalAPI, storeService }
