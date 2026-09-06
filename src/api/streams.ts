import api from './axios';
import { Bacenta } from './bacentas';
import { Member } from './members';

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

export const fetchStreamBacentas = async (id: number | string): Promise<Bacenta[]> => {
    const response = await api.get<{ success: boolean; data: Bacenta[] }>(`/v2/streams/${id}/bacentas`);
    return response.data.data;
};

export interface StreamMembersResponse {
    success: boolean;
    data: {
        total: number;
        members: Member[];
    };
    message: string;
}

export const fetchStreamMembers = async (id: number | string): Promise<number> => {
    const response = await api.get<StreamMembersResponse>(`/v2/streams/${id}/members`);
    return response.data.data.total;
};
