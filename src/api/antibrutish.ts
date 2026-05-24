import api from './axios';

export interface AntibrutishLeader {
    leader_id: number;
    region_id: number;
    total_hours_prayed: string;
    leader: {
        id: number;
        name: string;
        email: string;
    };
    region: {
        id: number;
        name: string;
    };
}

export interface AntibrutishLeadersResponse {
    success: boolean;
    data: AntibrutishLeader[];
    message: string;
}

export const fetchAntibrutishLeaders = async (cycleId: number = 1): Promise<AntibrutishLeader[]> => {
    const response = await api.get<AntibrutishLeadersResponse>('/v2/antibrutish/leaders', {
        params: { shepherdorial_cycle_id: cycleId }
    });
    return response.data.data;
};

export interface AntibrutishTotalHours {
    total_hours_prayed: string;
}

export interface AntibrutishTotalHoursResponse {
    success: boolean;
    data: AntibrutishTotalHours;
    message: string;
}

export const fetchAntibrutishTotalHours = async (cycleId: number = 1): Promise<number> => {
    const response = await api.get<AntibrutishTotalHoursResponse>('/v2/antibrutish/total-hours', {
        params: { shepherdorial_cycle_id: cycleId }
    });
    return Number(response.data.data.total_hours_prayed);
};
