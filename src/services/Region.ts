import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const getRegions = async (): Promise<AxiosResponse> => {
    return (await api.get('/regions', {}));
}

export const getRegion = async (id: number): Promise<AxiosResponse> => {
    return (await api.get(`/regions/${id}`, {}));
}