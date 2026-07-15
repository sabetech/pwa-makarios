import { useMutation } from 'react-query';
import api from './axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{
                name: string;
                permissions: Array<{
                    name: string;
                }>;
            }>;
        };
    };
}

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
};

export interface GoogleLoginPayload {
    token: string;
}

export const loginWithGoogle = async (data: GoogleLoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/v2/auth/google', data);
    return response.data;
};
