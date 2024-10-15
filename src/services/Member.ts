import { AxiosResponse } from 'axios';
import { TMember } from '../types/member'; 
import * as api from './API/MakariosAPI';

export const addMember = async (member: TMember): Promise<AxiosResponse> => {
    return (await api.post('/member', member, {}));
}

export const getMembers = async (): Promise<AxiosResponse> => {
    return (await api.get('/streams', {}));
}

// export const getStream = async (id: number): Promise<AxiosResponse> => {
//     return (await api.get(`/stream/${id}`, {}));
// }
