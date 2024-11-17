import * as apiClient from '../services/Region';
import { TRegion } from '../types/Region';
import * as queryKeys from '../constants/QueryKeys';
import { useQuery } from "react-query"

const _getRegions = async () => {

    const { data } = await apiClient.getRegions()
    return data.data
}

const _getRegion = async (id: number) => {
    const { data: region} = await apiClient.getRegion(id)
    return region.data
}

export const useGetRegions = () => {
    return  useQuery<TRegion[]>( 
        { 
            queryKey: [queryKeys.REGION_LIST_KEY],
            queryFn: async () => {
                return await _getRegions()
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