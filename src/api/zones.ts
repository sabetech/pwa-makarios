import api from './axios';

export interface Zone {
    id: number;
    name: string;
    region?: {
        id: number;
        name: string;
    };
    leader?: {
        id: number;
        name: string;
        img_url?: string;
    };
    bacenta_count?: number;
    members_count?: number;
}

export interface ZonesResponse {
    success: boolean;
    data: Zone[];
}

export const fetchZones = async (): Promise<Zone[]> => {
    const response = await api.get<ZonesResponse>('/v2/zones');
    return response.data.data;
};

export const createZone = async (data: { name: string; region_id: number }): Promise<Zone> => {
    const response = await api.post<{ success: boolean; data: Zone }>('/v2/zones', data);
    return response.data.data;
};

export const updateZone = async (id: number, data: { name?: string; region_id?: number; leader_id?: number }): Promise<Zone> => {
    const response = await api.put<{ success: boolean; data: Zone }>(`/v2/zones/${id}`, data);
    return response.data.data;
};

export const deleteZone = async (id: number): Promise<void> => {
    await api.delete(`/v2/zones/${id}`);
};