import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const getBacentas = async (): Promise<AxiosResponse> => {
    return (await api.get('/bacentas', {}));
}
