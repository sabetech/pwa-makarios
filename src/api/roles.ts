import api from './axios';

export interface Role {
    id: number;
    name: string;
}

export interface RolesResponse {
    success: boolean;
    data: Role[];
}

export const fetchRoles = async (): Promise<Role[]> => {
    const response = await api.get<RolesResponse>('/v2/roles');
    return response.data.data;
};
