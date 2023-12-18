import 'reflect-metadata'
import { container, type enphaseLocalAPI } from './lib/container'
import env from 'dotenv'
import { terminal } from 'terminal-kit'
import { type Reading } from './lib/services/enphaseDataTypes'

env.config()

const main = async (): Promise<void> => {
  const localAPI: enphaseLocalAPI = container.resolve('enphaseLocalAPI')
  const t = terminal
  await localAPI.authenticate()
  t.clear()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(async () => {
    const production = await localAPI.production()
    const totalConsumption: Reading = await localAPI.totalConsumption()
    const netConsumption: Reading = await localAPI.netConsumption()
    t.clear()
    console.log('Consumption: %s', totalConsumption.wNow)
    console.log('Production: %s', production.wNow)
    console.log('Importing: %s', netConsumption.wNow)
  }, 5000)
}
void main()
