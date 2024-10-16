import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';

export const authenticateStudent = async(indexnumber: number, passcode: string): Promise<AxiosResponse> => {
    return (await api.post('/authenticate', {index_number: indexnumber, passcode: passcode}, {}));
}

export const loginUser = async(email: string, password: string): Promise<AxiosResponse> => {
    return (await api.post('/login', {email: email, password: password}, {}));
}

export const logoutUser = async(token: string): Promise<AxiosResponse> => {
    return (await api.post('/logout', {}, {Authorization: 'Bearer ' + token}));
}

export const registerUser = async(name:string, email: string, password: string, c_password:string): Promise<AxiosResponse> => {
    return (await api.post('/register', {name: name, email: email, password: password, c_password: c_password}, {}));
}

export const uploadUserPhoto = async(formData: any): Promise<AxiosResponse> => {
    
    return (await api.postWithFile('/users/upload-photo', formData, {}));
}

export const uploadMemberPhoto = async(formData: any): Promise<AxiosResponse> => {
    
    return (await api.postWithFile('/members/upload-photo', formData, {}));
}