import { AxiosResponse } from 'axios';
import * as api from './API/MakariosAPI';
import { TUser } from '../types/user';

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

export const getUser = async(email: string): Promise<AxiosResponse> => {
    return (await api.get(`/user?email=${email}`, {}));
}

export const getUsers = async(filter?: { [key: string]: string | number | undefined | null }): Promise<AxiosResponse> => {
    const query = new URLSearchParams(filter as Record<string, string>).toString();

    console.log('Filter Query:', query);

    return (await api.get(`/users?${query}`, {}));
}

export const addUser = async(user: TUser): Promise<AxiosResponse> => {
    return (await api.post('/users', user, {}));
}

export const getRoles = async(): Promise<AxiosResponse> => {
    return (await api.get('/roles', {}));
}

export const addRole = async(role: { name: string, description?: string }): Promise<AxiosResponse> => {
    return (await api.post('/roles', role, {}));
}