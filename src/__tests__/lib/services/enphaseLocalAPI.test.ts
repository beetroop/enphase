import 'reflect-metadata';
import * as crypto from 'node:crypto'
import {container, enphaseLocalAPI, httpClient} from '../../../lib/container'

const mockObject = { get: jest.fn(), post: jest.fn() }

container.register<httpClient>("httpService", {
    useValue: mockObject as never as httpClient,
});

describe('enphaseLocalAPI', () => {
    it('should exist', async () => {
        const service = container.resolve("enphaseLocalAPI");
        expect(service).toBeDefined();
    });
    describe('generateCodeVerifier', () => {
        it('should generate a 32 byte code verifier', async () => {
            const service: enphaseLocalAPI = container.resolve("enphaseLocalAPI");
            const response = service['generateCodeVerifier']();
            expect(response.length).toEqual(43);
        });
    });
    describe('generateCodeChallenge', () => {
        it('should generate something', async () => {
            const service: enphaseLocalAPI = container.resolve("enphaseLocalAPI");
            const verifierCode = service['generateCodeVerifier']();
            const response = service['generateCodeChallenge'](verifierCode);
            const verifierCodeHash = crypto.createHash('sha256').update(verifierCode).digest();
            const verifierCodeHashBase64 = Buffer.from(verifierCodeHash).toString('base64url');
            expect(response).toEqual(verifierCodeHashBase64);
        });
    });
});
