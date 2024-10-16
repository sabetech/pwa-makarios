import { AxiosResponse } from 'axios';
import { TMemberRequest } from '../types/member'; 
import * as api from './API/MakariosAPI';

export const addMember = async (member: TMemberRequest): Promise<AxiosResponse> => {
    
    return (await api.postWithFile('/members', member, {}));
}

export const getMembers = async (): Promise<AxiosResponse> => {
    return (await api.get('/members', {}));
}

// export const getStream = async (id: number): Promise<AxiosResponse> => {
//     return (await api.get(`/stream/${id}`, {}));
// }
