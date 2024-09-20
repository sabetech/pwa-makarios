import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as api from './API/MakariosAPI';

export const verifyStudent = async (email: string): Promise<AxiosResponse> => {

    //return a fake response for testing
    const fakeResponse: AxiosResponse = {
        data: { 
            user: {
                name: "Michael Ochieng",
                email: email,
                already_exists: true
            },
            verified: true, 
            message: 'Student verified successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            url: '/verify-student',
      } as InternalAxiosRequestConfig<any>
    }
    
      // Returning a resolved promise with the fake response
      return Promise.resolve(fakeResponse);


    return (await api.post('/verify-email', {email: email}, {}));
}   

export const authenticateStudent = async(indexnumber: number, passcode: string): Promise<AxiosResponse> => {
    return (await api.post('/authenticate', {index_number: indexnumber, passcode: passcode}, {}));
}

export const loginUser = async(email: string, password: string): Promise<AxiosResponse> => {
    return (await api.post('/login', {email: email, password: password}, {}));
}

export const logoutUser = async(token: string): Promise<AxiosResponse> => {
    return (await api.post('/logout', {}, {Authorization: 'Bearer ' + token}));
}