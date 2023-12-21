import store, { type StoreType } from 'store2'
import { LocalStorage } from 'node-localstorage'

export interface IStoreService {
  get: (key: string) => string | number | Date
  put: (key: string, value: string | number | Date) => void
}

export class storeService implements IStoreService {
  private readonly storage: StoreType
  constructor () {
    const localStorage = new LocalStorage(process.env.FILE_STORAGE_PATH ?? './')
    const storeInstance = store.area('fs', localStorage)
    this.storage = storeInstance.namespace('fs')
  }

  get<T> (key: string): T {
    return this.storage.get(key)
  }

  async put (key: string, value: string | number | Date): Promise<void> {
    await this.storage.set(key, value)
  }
}
