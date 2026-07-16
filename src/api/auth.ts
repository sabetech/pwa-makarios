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

export interface GoogleLoginResponse {
    success: boolean;
    data: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone?: string;
            img_url?: string;
            roles: Array<{
                name: string;
                permissions: Array<{
                    name: string;
                }>;
            }>;
        };
        is_new_user: boolean;
    };
}

export const loginWithGoogle = async (data: GoogleLoginPayload): Promise<GoogleLoginResponse> => {
    const response = await api.post<GoogleLoginResponse>('/v2/auth/google', data);
    return response.data;
};

export interface CompleteProfilePayload {
    phone: string;
    image?: File;
}

export interface CompleteProfileResponse {
    success: boolean;
    data: {
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            img_url: string;
            roles: Array<{
                name: string;
                permissions: Array<{
                    name: string;
                }>;
            }>;
        };
    };
}

export const completeProfile = async (data: CompleteProfilePayload): Promise<CompleteProfileResponse> => {
    const formData = new FormData();
    formData.append('phone', data.phone);
    if (data.image) {
        formData.append('image', data.image);
    }
    const response = await api.post<CompleteProfileResponse>('/v2/auth/complete-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
