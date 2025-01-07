import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const getServiceTypes = async (): Promise<AxiosResponse> => {
    return (await api.get('/service/types', {}));
}

export const addService = async (service: any): Promise<AxiosResponse> => {
    return (await api.postWithFile('/service', service, {}));
}

