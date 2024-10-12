import { AxiosResponse } from 'axios';
import { TStream } from '../types/stream'; 
import * as api from './API/MakariosAPI';

export const addStream = async (stream: TStream): Promise<AxiosResponse> => {
    return (await api.post('/stream', stream, {}));
}

export const getStreams = async (): Promise<AxiosResponse> => {
    return (await api.get('/streams', {}));
}

export const getStream = async (id: number): Promise<AxiosResponse> => {
    return (await api.get(`/stream/${id}`, {}));
}
