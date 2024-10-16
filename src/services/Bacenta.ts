import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

// export const addCouncil = async (bacenta: TBacenta): Promise<AxiosResponse> => {
//     return (await api.post('/councils', council, {}));
// }

export const getBacentas = async (): Promise<AxiosResponse> => {
    return (await api.get('/bacentas', {}));
}
