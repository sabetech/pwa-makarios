import api from './axios';

export interface ArrivalRecord {
    id: number;
    date: string;
    time: string;
    bacenta_id: number;
    number_bussed: number;
    img_proof?: string;
    bacenta?: {
        id: number;
        name: string;
        leader?: {
            id: number;
            name: string;
        };
        region?: {
            id: number;
            name: string;
        };
    };
}

export interface BacentaBreakdown {
    bacenta_id: number;
    bacenta_name: string;
    leader_name: string;
    region_name: string;
    number_bussed: number;
    filled: boolean;
    arrival_id: number | null;
    time: string | null;
    date: string | null;
}

export interface ArrivalsData {
    date: string;
    total_bussed: number;
    role: string;
    arrivals: ArrivalRecord[];
    breakdown: BacentaBreakdown[];
}

export interface ArrivalsResponse {
    success: boolean;
    message: string;
    data: ArrivalsData;
}

export interface CreateArrivalPayload {
    bacenta_id: number;
    date: string;
    time?: string;
    number_bussed: number;
}

export const fetchArrivals = async (date?: string): Promise<ArrivalsData> => {
    const response = await api.get<ArrivalsResponse>('/v2/arrivals', {
        params: date ? { date } : {},
    });
    return response.data.data;
};

export const createArrival = async (payload: CreateArrivalPayload): Promise<ArrivalRecord> => {
    const response = await api.post<{ success: boolean; data: ArrivalRecord }>('/v2/arrivals', payload);
    return response.data.data;
};
