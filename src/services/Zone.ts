import { AxiosResponse } from 'axios';

import * as api from './API/MakariosAPI';
import { TZone } from '../types/zone';
import { TFilterType } from '../types/member';

export const addZone = async (stream: TZone): Promise<AxiosResponse> => {
    return (await api.post('/zone', stream, {}));
}

export const getZones = async (filter?: TFilterType): Promise<AxiosResponse> => {
    
    if (!filter) {
        return (await api.get('/zones', {}));
    }
    const filterParams = Object.entries(filter).map(([key, value]) => `${key}=${value}`).join('&');
    console.log("Filter params::", filterParams)
    

    return (await api.get(`/zones?${filterParams}`, {}));
}

export const getZone = async (id: number): Promise<AxiosResponse> => {
    return (await api.get(`/zone/${id}`, {}));
}
