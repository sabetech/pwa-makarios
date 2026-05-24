import api from './axios';

export interface SheepSeekingRecord {
    id: number;
    date: string;
    leader_id: number;
    member_visited_id: number;
    campaign_id: number;
    visitation_report: string;
    shepherdorial_cycle_id: number;
    leader: {
        id: number;
        name: string;
        region: { id: number; name: string } | null;
    };
    member_visited: {
        id: number;
        name: string;
        img_url: string | null;
        region_id: number | null;
        region: { id: number; name: string } | null;
    };
}

export interface SheepSeekingResponse {
    success: boolean;
    data: SheepSeekingRecord[];
    message: string;
}

export const fetchSheepSeekingRecords = async (cycleId: number = 1): Promise<SheepSeekingRecord[]> => {
    const response = await api.get<SheepSeekingResponse>('/v2/sheep-seeking', {
        params: { shepherdorial_cycle_id: cycleId }
    });
    return response.data.data;
};

export interface SheepSeekingTotalVisits {
    total_visits: number;
}

export interface SheepSeekingTotalVisitsResponse {
    success: boolean;
    data: SheepSeekingTotalVisits;
    message: string;
}

export const fetchSheepSeekingTotalVisits = async (cycleId: number = 1): Promise<number> => {
    const response = await api.get<SheepSeekingTotalVisitsResponse>('/v2/sheep-seeking/total-visits', {
        params: { shepherdorial_cycle_id: cycleId }
    });
    return Number(response.data.data.total_visits);
};
