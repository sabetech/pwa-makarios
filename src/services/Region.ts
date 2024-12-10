import { TFilterType } from '../types/member';
import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const getRegions = async (filter?: TFilterType): Promise<AxiosResponse> => {
    if (!filter || filter == null || filter == undefined) {
        return (await api.get('/regions', {}));
    }
    const filterParams = Object.entries(filter).map(([key, value]) => `${key}=${value}`).join('&');
    return (await api.get(`/regions?${filterParams}`, {}));
}

export const getRegion = async (id: number): Promise<AxiosResponse> => {
    return (await api.get(`/regions/${id}`, {}));
}