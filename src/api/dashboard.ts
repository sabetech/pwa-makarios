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

export interface WeeklyTrendPoint {
    name: string;
    attendance: number;
    income: number;
}

export interface DashboardSummary {
    avg_attendance: number | null;
    weekly_income: number;
    bussing: number | null;
    bussing_date: string | null;
    weekly_trend: WeeklyTrendPoint[];
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<{ success: boolean; data: DashboardSummary }>('/v2/dashboard/summary');
    return response.data.data;
};
