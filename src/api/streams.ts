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
    // The user specified api/v2/streams. Our axios instance base URL is already .../api
    const response = await api.get<StreamsResponse>('/v2/streams');
    return response.data.data;
};
