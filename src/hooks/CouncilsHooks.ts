import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Council';
import * as queryKeys from '../constants/QueryKeys';
import { TStream } from '../types/stream';
import { TCouncil } from '../types/council';


const _addCouncil = async (council: TCouncil) => {
    
    const { data } = await apiClient.addCouncil(council)
    return data;
  };

const _getCouncils = async () => {

    const { data } = await apiClient.getCouncils()
    return data
}

export const useAddStream = () => {
    
    return useMutation(async (council: TCouncil) => _addCouncil(council), {
        onSuccess: (councilResponse) => {
            // invalidate the query cache for 'churches'

            console.log("response ", councilResponse)

            // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
        },
        onError: (error) => {
            // handle error
        },
    });
}

export const useGetCouncil = () => {
    return  useQuery( 
        { 
            queryKey: [queryKeys.COUNCIL_LIST_KEY],
            queryFn: async () => {
                return await _getCouncils()
            },
        })
}