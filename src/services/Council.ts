import { AxiosResponse } from 'axios';
import { TCouncil } from '../types/council'; 
import * as api from './API/MakariosAPI';

export const addCouncil = async (council: TCouncil): Promise<AxiosResponse> => {
    return (await api.post('/councils', council, {}));
}

export const getCouncils = async (): Promise<AxiosResponse> => {
    return (await api.get('/councils', {}));
}
