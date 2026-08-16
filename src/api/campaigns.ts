import api from './axios';

export interface Campaign {
    id: number;
    name: string;
    description: string;
    is_active: number;
    target: number;
    unit: string;
    icon: string | null;
    shepherdorial_cycle_id: number;
    shepherdorial_cycle: {
        id: number;
        name: string;
        cycle_start: string;
        cycle_end: string;
    };
}

export interface CampaignsResponse {
    success: boolean;
    data: Campaign[];
    message: string;
}

export interface ShepherdorialCycle {
    id: number;
    name: string;
    cycle_start: string;
    cycle_end: string;
}

export interface ShepherdorialCyclesResponse {
    success: boolean;
    data: ShepherdorialCycle[];
    message: string;
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
    const response = await api.get<CampaignsResponse>('/v2/campaigns');
    return response.data.data;
};

export const fetchShepherdorialCycles = async (): Promise<ShepherdorialCycle[]> => {
    const response = await api.get<ShepherdorialCyclesResponse>('/v2/shepherdorial-cycles');
    return response.data.data;
};

export const createShepherdorialCycle = async (data: { name: string; cycle_start: string; cycle_end: string }): Promise<ShepherdorialCycle> => {
    const response = await api.post('/v2/shepherdorial-cycles', data);
    return response.data.data;
};

export const updateShepherdorialCycle = async (id: number, data: { name: string; cycle_start: string; cycle_end: string }): Promise<ShepherdorialCycle> => {
    const response = await api.put(`/v2/shepherdorial-cycles/${id}`, data);
    return response.data.data;
};
