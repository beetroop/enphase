export interface IStoreService {
  get: (data: string) => Promise<string>
  put: (data: string) => Promise<void>
}

export class storeService {
  private readonly directory: string
  constructor () {
    console.log('storeService constructor called')
    this.directory = 'store'
  }

  async get (data: string): Promise<string> {
    console.log('storeService get called')
    return await Promise.resolve('get')
  }

  async put (data: string): Promise<void> {
    console.log('storeService put called')
    await Promise.resolve()
  }
}
