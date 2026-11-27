import { useMutation } from 'react-query';
import { loginUser, LoginResponse } from '../api/auth';
import { saveSession } from '../utils/authStorage';

export const useLogin = () => {
    return useMutation(loginUser, {
        onSuccess: (data: LoginResponse) => {
            if (data.success && data.data) {
                const { token, user } = data.data;
                saveSession(token, user);
            }
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
        },
    });
};
