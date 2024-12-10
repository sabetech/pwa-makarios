import * as apiClient from '../services/Region';
import { TRegion } from '../types/Region';
import * as queryKeys from '../constants/QueryKeys';
import { useQuery } from "react-query"
import { TFilterType } from '../types/member';

const _getRegions = async (filter?: TFilterType) => {
    console.log("what are filtering by::", filter)
    const { data } = await apiClient.getRegions(filter)
    return data.data
}

const _getRegion = async (id: number) => {
    const { data: region} = await apiClient.getRegion(id)
    return region.data
}

export const useGetRegions = (filter?: TFilterType) => {
    return  useQuery<TRegion[]>( 
        { 
            queryKey: [queryKeys.REGION_LIST_KEY],
            queryFn: async () => {
                return await _getRegions(filter)
            },
        })
}

export const useGetRegion = (id: number) => {
    return useQuery<TRegion>({
        queryKey: [queryKeys.REGION_ITEM_KEY],
        queryFn: async () => {
            return await _getRegion(id);
        }
    })
}