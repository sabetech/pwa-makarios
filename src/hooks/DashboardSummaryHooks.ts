import { useQuery } from 'react-query';
import { TDashboardSummary } from '../types/dashboard';
import * as queryKeys from '../constants/QueryKeys';
import * as apiClient from '../services/Dashboard';


const _getSummary = async () => {

    const { data } = await apiClient.getDashboardSummary()
    return data
}

export const useGetDashboardSummaries = () => {
    return  useQuery<TDashboardSummary[]>( 
        { 
            queryKey: [queryKeys.DASHBOARD_SUMMARY_KEY],
            queryFn: async () => {
                return await _getSummary()
            },
        })
}