import api from './axios';

export interface Bacenta {
    id: number;
    name: string;
    members_count: number;
    region?: {
        id: number;
        name: string;
        stream?: {
            name: string;
        };
    };
    zone?: {
        id: number;
        name: string;
    };
    leader?: {
        name: string;
        img_url?: string;
    };
}

export interface BacentasResponse {
    success: boolean;
    data: Bacenta[];
}

export const fetchBacentas = async (): Promise<Bacenta[]> => {
    const response = await api.get<BacentasResponse>('/v2/bacentas');
    return response.data.data;
};

export const deleteBacenta = async (id: number): Promise<void> => {
    await api.delete(`/v2/bacentas/${id}`);
};

export const createBacenta = async (data: { name: string; region_id?: number; leader_id?: number }): Promise<Bacenta> => {
    const response = await api.post<{ success: boolean; data: Bacenta }>('/v2/bacentas', data);
    return response.data.data;
};

export const updateBacenta = async (id: number, data: Partial<Bacenta>): Promise<Bacenta> => {
    const response = await api.put<{ success: boolean; data: Bacenta }>(`/v2/bacentas/${id}`, data);
    return response.data.data;
};

export interface BacentaService {
    id: number;
    date: string;
    attendance: number;
    offering: number;
}

export interface BacentaLocation {
    id: number;
    name: string;
    lat_lng?: string | null;
    address?: string | null;
}

export interface BacentaDetails extends Bacenta {
    is_active: boolean;
    members_count: number;
    recent_services: BacentaService[];
    location?: BacentaLocation | null;
}

export interface Member {
    id: number;
    name: string;
    img_url?: string;
    phone?: string;
}

interface SingleResponse<T> {
    success: boolean;
    data: T;
}

export const fetchBacenta = async (id: number): Promise<BacentaDetails> => {
    const response = await api.get<SingleResponse<BacentaDetails>>(`/v2/bacentas/${id}`);
    return response.data.data;
};

export const fetchBacentaMembers = async (id: number): Promise<Member[]> => {
    const response = await api.get<SingleResponse<Member[]>>(`/v2/bacentas/${id}/members`);
    return response.data.data;
};

export const suspendBacenta = async (id: number): Promise<void> => {
    await api.post(`/v2/bacentas/${id}/suspend`);
};

export const activateBacenta = async (id: number): Promise<void> => {
    await api.post(`/v2/bacentas/${id}/activate`);
};
