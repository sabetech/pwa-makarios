import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';
import { convertObjectToQueryString } from '../utils/helper';
import { TMicrochurchFormValues } from '../types/microchurch';

export const getMicrochurches = async (filter?: any): Promise<AxiosResponse> => {
    if (!filter || filter == null || filter == undefined) {
        return (await api.get('/microchurches', {}));
    }
    const filterParams = convertObjectToQueryString(filter);
    
    return (await api.get(`/microchurches?${filterParams}`, {}));
}

export const addMicrochurch = async (microchurch: TMicrochurchFormValues): Promise<AxiosResponse> => {
    return (await api.post('/microchurches', microchurch, {}));
}

export const getMicroChurch = async (id: number): Promise<AxiosResponse> => {
    return (await api.get(`/microchurches/${id}`, {}));
}

