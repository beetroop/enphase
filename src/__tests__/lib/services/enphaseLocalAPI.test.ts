import 'reflect-metadata';
import {container, enphaseLocalAPI, httpService} from '../../../lib/container'

const mockObject = { fetch: jest.fn(), fetchUnsafe: jest.fn() }

container.register<httpService>("httpService", {
    useValue: mockObject as httpService,
});

describe('enphaseLocalAPI', () => {
    it('should exist', async () => {
        const service = container.resolve("enphaseLocalAPI");
        expect(service).toBeDefined();
    });
    it('should respond true to a ping request', async () => {
        const service: enphaseLocalAPI = container.resolve("enphaseLocalAPI");
        mockObject.fetchUnsafe.mockResolvedValueOnce({status: 200});
        const response = await service.ping();
        expect(response).toEqual(true);
    });
    it('should respond false to a ping request when not up', async () => {
        const service: enphaseLocalAPI = container.resolve("enphaseLocalAPI");
        //mock the fetch method
        mockObject.fetchUnsafe.mockRejectedValueOnce(new Error("error"));
        const response = await service.ping();
        expect(response).toEqual(false);
    });
});
