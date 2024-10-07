import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Church';
import * as queryKeys from '../constants/QueryKeys';
import { TChurchInfo } from '../types/church';


const _addChurch = async (churchInfo: TChurchInfo) => {
    
    const { data } = await apiClient.addChurch(churchInfo)
    return data;
  };

const _getChurches = async () => {

    const { data } = await apiClient.getChurches()
    return data
}

export const useAddChurch = () => {
    
    return useMutation(async (churchInfo: TChurchInfo) => _addChurch(churchInfo), {
        onSuccess: (churchresponse) => {
            // invalidate the query cache for 'churches'

            console.log("response ", churchresponse)

            // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
        },
        onError: (error) => {
            // handle error
        },
    });
}

export const useGetChurches = () => {
    return  useQuery( 
        { 
            queryKey: [queryKeys.CHURCH_LIST_KEY],
            queryFn: async () => {
                return await _getChurches()
            },
        })
}