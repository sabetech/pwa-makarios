import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const getServiceTypes = async (): Promise<AxiosResponse> => {
    return (await api.get('/service/types', {}));
}

export const addService = async (service: any): Promise<AxiosResponse> => {
    return (await api.postWithFile('/service', service, {}));
}

export const getServices = async (filter?: any): Promise<AxiosResponse> => {
    if (!filter || filter == null || filter == undefined) {
        return (await api.get('/services', {}));
    }
    const filterParams = Object.entries(filter).map(([key, value]) => `${key}=${value}`).join('&');
    
    return (await api.get(`/services?${filterParams}`, {}));
}

