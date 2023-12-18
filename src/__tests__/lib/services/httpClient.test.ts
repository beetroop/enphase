import 'reflect-metadata'
import { type HttpClient, httpClientFactory } from '../../../lib/container'
import MockAdapter from 'axios-mock-adapter'
import axios, { type AxiosResponse } from 'axios'
import { describe } from 'node:test'

void describe('httpClient', () => {
  it('should exist', async () => {
    const client = httpClientFactory.create(new URL('http://coolurl.com'))
    expect(client).toBeDefined()
  })
  void describe('get', () => {
    it('should successfully fetch a valid url', async () => {
      const mock = new MockAdapter(axios)
      const data = { response: true }
      mock.onGet('http://coolurl.com/socool').reply(200, data)
      const client: HttpClient = httpClientFactory.create(new URL('http://coolurl.com'))
      const response: AxiosResponse = await client.get('/socool')
      expect(response.status).toEqual(200)
      expect(response.data).toStrictEqual(data)
    })
    it('should throw an error when fetching an invalid url', async () => {
      const mock = new MockAdapter(axios)
      mock.onGet('http://bogusurl.man/whack').networkError()
      const client: HttpClient = httpClientFactory.create(new URL('http://bogusurl.man'))
      await expect(client.get('/whack')).rejects.toThrow()
    })
  })
})
