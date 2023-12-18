export interface Reading {
  type: string
  activeCount: number
  readingTime: number
  wNow: number
  whLifetime: number
  measurementType?: string
  varhLeadLifetime?: number
  varhLagLifetime?: number
  vahLifetime?: number
  rmsCurrent?: number
  rmsVoltage?: number
  reactPwr?: number
  apprntPwr?: number
  pwrFactor?: number
  whToday?: number
  whLastSevenDays?: number
  vahToday?: number
  varhLeadToday?: number
  varhLagToday?: number
  whNow?: number
  state?: string
}

export interface Measurements {
  production: Reading[]
  consumption: Reading[]
  storage: Reading[]
}
