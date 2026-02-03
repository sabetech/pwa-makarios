import { useMutation } from 'react-query';
import { loginUser, LoginResponse } from '../api/auth';

export const useLogin = () => {
    return useMutation(loginUser, {
        onSuccess: (data: LoginResponse) => {
            // Handle successful login (e.g., store token, redirect)
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token); // Example: Store token
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
        },
    });
};
