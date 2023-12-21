import 'reflect-metadata'
import { container, type enphaseLocalAPI } from './lib/container'
import env from 'dotenv'
import { terminal } from 'terminal-kit'
import { type Reading } from './lib/services/enphaseDataTypes'

env.config()

const main = async (): Promise<void> => {
  const localAPI: enphaseLocalAPI = container.resolve('enphaseLocalAPI')
  const t = terminal
  t.clear()
  await localAPI.authenticate()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(async () => {
    const production = await localAPI.production()
    const totalConsumption: Reading = await localAPI.totalConsumption()
    const netConsumption: Reading = await localAPI.netConsumption()
    t.clear()
      .bold('Current')
      .nextLine(1)
      .white('Consumption: ')
      .green(totalConsumption.wNow + 'W')
      .nextLine(1)
      .white('Production: ')
      .green(production.wNow + 'W')
      .nextLine(1)
      .white('Net Import: ')
      .green(netConsumption.wNow + 'W')
      .nextLine(1)
      .bold('Today')
      .nextLine(1)
      .white('Consumption: ')
      .green(totalConsumption.whToday + 'Wh')
      .nextLine(1)
      .white('Production: ')
      .green(production.whToday + 'Wh')
      .nextLine(1)
      .white('Net Import: ')
      .green(netConsumption.whToday + 'Wh')
      .nextLine(1)
      .bold('Lifetime')
      .nextLine(1)
      .white('Consumption: ')
      .green(totalConsumption.whLifetime + 'Wh')
      .nextLine(1)
      .white('Production: ')
      .green(production.whLifetime + 'Wh')
      .nextLine(1)
      .white('Net Import: ')
      .green(netConsumption.whLifetime + 'Wh')
      .nextLine(1)
      .white('Press Ctrl+C to exit')
      .hideCursor()
  }, parseInt(process.env.INTERVAL ?? '5000'))
}

void main()
