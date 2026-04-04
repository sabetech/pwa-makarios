import api from './axios';

export interface DashboardData {
    [key: string]: number | string;
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get<DashboardResponse>('/v2/dashboard');
    return response.data.data;
};
