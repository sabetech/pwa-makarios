import api from './axios';

export interface Campaign {
    id: number;
    name: string;
    description: string;
    is_active: number;
    target: number;
    unit: string;
    cycle_start: string;
    cycle_end: string;
    icon: string | null;
}

export interface CampaignsResponse {
    success: boolean;
    data: Campaign[];
    message: string;
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
    const response = await api.get<CampaignsResponse>('/v2/campaigns');
    return response.data.data;
};
