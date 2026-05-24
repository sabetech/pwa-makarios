import api from './axios';

export interface MultiplicationTotalSoulsResponse {
    success: boolean;
    data: {
        total_souls_saved: string;
    };
    message: string;
}

export const fetchMultiplicationTotalSouls = async (cycleId: number = 1): Promise<number> => {
    const response = await api.get<MultiplicationTotalSoulsResponse>('/v2/multiplication-campaigns/total-souls', {
        params: { shepherdorial_cycle_id: cycleId }
    });
    return Number(response.data.data.total_souls_saved);
};
