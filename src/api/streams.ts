import api from './axios';

export interface Stream {
    id: number;
    name: string;
    description?: string;
    meeting_time: string;
    meeting_day: string; // Comma-separated days, e.g., "MON,WED,FRI"
    overseer?: {
        name: string;
        imgurl?: string;
        role?: string;
    }
}

export interface StreamsResponse {
    success: boolean;
    data: Stream[];
}

export const fetchStreams = async (): Promise<Stream[]> => {
    const response = await api.get<StreamsResponse>('/v2/streams');
    return response.data.data;
};

export const fetchStream = async (id: number | string): Promise<Stream> => {
    const response = await api.get<{ success: boolean; data: Stream }>(`/v2/streams/${id}`);
    return response.data.data;
};

export const fetchStreamRegions = async (id: number | string): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>(`/v2/streams/${id}/regions`);
    return response.data.data;
};
