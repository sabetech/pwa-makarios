import api from './axios';

export interface RegionBacenta {
    id: number;
    name: string;
    leader?: {
        name: string;
        img_url?: string;
    };
    members_count: number;
}

export interface RegionMember {
    id: number;
    name: string;
    phone?: string;
    img_url?: string;
}

export interface Region {
    id: number;
    name: string;
    bacenta_count: number;
    members_count: number;
    bacentas: any[];
    members_through: RegionMember[];
    leader?: {
        name: string;
        img_url?: string;
    };
    stream?: {
        id?: number;
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

export const createRegion = async (data: { name: string; stream_id?: number; leader_id?: number }): Promise<Region> => {
    const response = await api.post<{ success: boolean; data: Region }>('/v2/regions', data);
    return response.data.data;
};

export const updateRegion = async (id: number, data: Partial<Region>): Promise<Region> => {
    const response = await api.put<{ success: boolean; data: Region }>(`/v2/regions/${id}`, data);
    return response.data.data;
};

export interface TransferResult {
    region: Region;
    from_stream_id: number;
    to_stream: { id: number; name: string };
    bacentas_moved: number;
    members_updated: number;
    services_updated: number;
    microchurches_updated: number;
}

export const transferRegion = async (id: number, stream_id: number): Promise<TransferResult> => {
    const response = await api.post<{ success: boolean; data: TransferResult }>(`/v2/regions/${id}/transfer`, { stream_id });
    return response.data.data;
};

export const fetchRegion = async (id: number | string): Promise<Region> => {
    const response = await api.get<{ success: boolean; data: Region }>(`/v2/regions/${id}`);
    return response.data.data;
};

export const fetchRegionBacentas = async (id: number | string): Promise<RegionBacenta[]> => {
    const response = await api.get<{ success: boolean; data: RegionBacenta[] }>(`/v2/regions/${id}/bacentas`);
    return response.data.data;
};
