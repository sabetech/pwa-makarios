import { AxiosResponse } from 'axios';
import { TMemberRequest, TFilterType } from '../types/member'; 
import * as api from './API/MakariosAPI';

export const addMember = async (member: TMemberRequest): Promise<AxiosResponse> => {
    return (await api.postWithFile('/members', member, {}));
}

export const getMembers = async (filter?: TFilterType): Promise<AxiosResponse> => {
    console.log("Do you get here??>>", filter)
    if (!filter) {
        return (await api.get('/members', {}));
    }
    const filterParams = Object.entries(filter).map(([key, value]) => `${key}=${value}`).join('&');
    console.log("Filter params::", filterParams)
    
    return (await api.get(`/members?${filterParams}`, {}));
}

// export const getStream = async (id: number): Promise<AxiosResponse> => {
//     return (await api.get(`/stream/${id}`, {}));
// }
