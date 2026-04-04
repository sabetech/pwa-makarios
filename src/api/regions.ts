import api from './axios';

export interface Region {
    id: number;
    name: string;
    bacenta_count: number;
    members_count: number;
    leader?: {
        name: string;
        img_url?: string;
    };
    stream?: {
        name: string;
    }
}

export interface RegionsResponse {
    success: boolean;
    data: Region[];
}

export const fetchRegions = async (): Promise<Region[]> => {
    const response = await api.get<RegionsResponse>('/v2/regions');
    return response.data.data;
};

export const deleteRegion = async (id: number): Promise<void> => {
    await api.delete(`/v2/regions/${id}`);
};

export const updateRegion = async (id: number, data: Partial<Region>): Promise<Region> => {
    const response = await api.put<{ success: boolean; data: Region }>(`/v2/regions/${id}`, data);
    return response.data.data;
};
