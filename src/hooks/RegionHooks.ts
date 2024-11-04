import * as apiClient from '../services/Region';
import { TRegion } from '../types/Region';
import * as queryKeys from '../constants/QueryKeys';
import { useQuery } from "react-query"

const _getRegions = async () => {

    const { data } = await apiClient.getRegions()
    return data
}

export const useGetRegion = () => {
    return  useQuery<TRegion[]>( 
        { 
            queryKey: [queryKeys.MEMBER_LIST_KEY],
            queryFn: async () => {
                return await _getRegions()
            },
        })
}