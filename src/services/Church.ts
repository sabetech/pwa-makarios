import { AxiosResponse } from 'axios';
import { TChurchInfo } from "../types/church";
import * as api from './API/MakariosAPI';

export const addChurch = async (churchInfo: TChurchInfo): Promise<AxiosResponse> => {
    return (await api.post('/churches', churchInfo, {}));
}

export const getChurches = async (): Promise<AxiosResponse> => {
    return (await api.get('/churches', {}));
}
