import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';
import { TArrivalForm } from '../types/arrivals';

export const addArrivalReport = async (arrivalForm: TArrivalForm):Promise<AxiosResponse> => {
    return (await api.post('/arrivals/', arrivalForm, {}));
}