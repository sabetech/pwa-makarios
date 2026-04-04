import api from './axios';

export interface Bacenta {
    id: number;
    name: string;
    members_count: number;
    region?: {
        name: string;
        stream?: {
            name: string;
        };
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

export const updateBacenta = async (id: number, data: Partial<Bacenta>): Promise<Bacenta> => {
    const response = await api.put<{ success: boolean; data: Bacenta }>(`/v2/bacentas/${id}`, data);
    return response.data.data;
};
