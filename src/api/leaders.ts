import api from './axios';

export interface Leader {
    id: number;
    name: string;
    img_url: string | null;
    role: string;
    leading?: {
        name: string;
        type: string;
    };
}

export interface LeadersResponse {
    success: boolean;
    data: Leader[];
}

export const fetchLeaders = async (): Promise<Leader[]> => {
    const response = await api.get<LeadersResponse>('/v2/leaders');
    return response.data.data;
};

export const deleteLeader = async (id: number): Promise<void> => {
    await api.delete(`/v2/leaders/${id}`);
};

export const updateLeader = async (id: number, data: Partial<Leader>): Promise<Leader> => {
    const response = await api.put<{ success: boolean; data: Leader }>(`/v2/leaders/${id}`, data);
    return response.data.data;
};
