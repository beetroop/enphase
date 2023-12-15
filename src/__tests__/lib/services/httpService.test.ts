import 'reflect-metadata';
import {container, httpService} from '../../../lib/container'
import MockAdapter  from "axios-mock-adapter";
import axios from "axios";
import {describe} from "node:test";

describe('httpService', () => {
    it('should exist', async () => {
        const service = container.resolve("httpService");
        expect(service).toBeDefined();
    });
    describe('fetch', () => {
        it('should successfully fetch a valid url', async () => {
            const service: httpService = container.resolve("httpService");
            const mock = new MockAdapter(axios);
            const data = { response: true };
            mock.onGet('http://coolurl.com').reply(200, data);
            const response = await service.fetch("http://coolurl.com");
            expect(response.status).toEqual(200);
            expect(response.data).toStrictEqual(data);
        });
        it('should throw an error when fetching an invalid url', async () => {
            const service: httpService = container.resolve("httpService");
            const mock = new MockAdapter(axios);
            mock.onGet('http://bogusurl.man').networkError();
            await expect(service.fetch("http://bogusurl.man")).rejects.toThrow();
        })
    });
    describe('fetchUnsafe', () => {
        it('should successfully fetch a valid url', async () => {
            const service: httpService = container.resolve("httpService");
            const mock = new MockAdapter(axios);
            const data = { response: true };
            mock.onGet('http://coolurl.com').reply(200, data);
            const response = await service.fetchUnsafe("http://coolurl.com");
            expect(response.status).toEqual(200);
            expect(response.data).toStrictEqual(data);
        });
        it('should throw an error when fetching an invalid url', async () => {
            const service: httpService = container.resolve("httpService");
            const mock = new MockAdapter(axios);
            mock.onGet('http://bogusurl.man').networkError();
            await expect(service.fetchUnsafe("http://bogusurl.man")).rejects.toThrow();
        })
    });
});
