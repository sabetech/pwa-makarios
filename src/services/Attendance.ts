import { AxiosResponse } from 'axios';
import * as api from './API/AnagkazoAPI';
import { IAttendanceRequestInfo } from '../interfaces/Attendance';

export const postAttendance = async (indexnumber: number = 701274, attendanceInfo: IAttendanceRequestInfo): Promise<AxiosResponse> => {
    return (await api.post('/attendance/'+indexnumber, attendanceInfo, {}));
}

export const getAttendance = async (indexnumber: number = 701274, event: string): Promise<AxiosResponse> => {
    return (await api.get(`/attendance/${indexnumber}?event=${event}`, {}));
}