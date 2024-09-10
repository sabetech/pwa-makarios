import { AxiosResponse } from 'axios';
import * as api from './API/AnagkazoAPI';
import { IBussingInfo } from '../interfaces/BussingInfo';

export const getPastoralPoint = async (indexnumber: number = 701274): Promise<AxiosResponse> => {
    return (await api.get('/pastoral-points/'+indexnumber, {}));
}

export const postNumberBussed = async (bussingInfo: IBussingInfo): Promise<AxiosResponse> => {
    return (await api.postWithFile('/bussing/'+bussingInfo.index_number, bussingInfo, {}));
}

export const getBussing = async (indexnumber: number = 701274): Promise<AxiosResponse> => {
    return (await api.get(`/bussing/${indexnumber}`, {}));
}
