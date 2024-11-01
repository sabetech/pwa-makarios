import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';


export const getDashboardSummary = async (): Promise<AxiosResponse> => {
    return (await api.get('/dashboard-summary', {})).data;
}

