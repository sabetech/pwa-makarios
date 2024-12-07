import { TZone } from "../types/zone"
import { useQuery } from "react-query"
import * as queryKeys from "../constants/QueryKeys"
import { TFilterType } from "../types/member"
import * as apiClient from "../services/Zone"

const _getZones = async (filter? : TFilterType) => {

    const { data } = await apiClient.getZones(filter)
    return data.data
}

export const useGetZones = (filter?: TFilterType) => {
    return  useQuery<TZone[]>(
        { 
            queryKey: [queryKeys.ZONE_LIST_KEY, JSON.stringify(filter)],
            queryFn: async () => {
                return await _getZones(filter)
            },
        }
    )
}