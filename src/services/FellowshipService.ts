import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';
import { FellowshipServiceFormFields } from '../types/fellowshipFormFields';

export const postFellowshipService = async (studentID: number, fellowshipServiceForm: FellowshipServiceFormFields): Promise<AxiosResponse> => {

    console.log("studentId::",studentID);
    console.log("FellowshipShip::", fellowshipServiceForm);

    return (await api.postWithFile('/fellowship_service/'+studentID, fellowshipServiceForm, {}));
}

export const getFellowshipServices = async (studentId: number): Promise<AxiosResponse> => {
    return (await api.get(`/fellowship_service/${studentId}`, {})).data;
}

export const cancelFellowshipService = async(studentId: number, reason: string, service_date: string): Promise<AxiosResponse> => {
    return (await api.post(`/fellowship_service/${studentId}/cancel`,{
        service_date, 
        reason: reason
    }, {})).data
}