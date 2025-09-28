import { useQuery, useMutation } from 'react-query';
import * as apiClient from '../services/MicroChurches';
import { TMicrochurch, TMicrochurchFormValues } from '../types/microchurch'
import * as queryKeys from '../constants/QueryKeys';
import { TFilterType } from '../types/generic';

export const useGetMicrochurches = (filter?: TFilterType) => {

    return useQuery<TMicrochurch[]>({
        queryKey: [queryKeys.MICROCHURCH_LIST_KEY, filter],
        queryFn: async () => {
            const { data } = await apiClient.getMicrochurches(filter);
            return data.data;
        },
        enabled: !filter || Object.keys(filter).length > 0
    });
}

export const useAddMicrochurch = () => {
    return useMutation(async (microchurch: TMicrochurchFormValues) => {
        
        const { data } = await apiClient.addMicrochurch(microchurch);
        return data;

    }, {
        onSuccess: (microchurchResponse) => {
            console.log("response from adding microchurch", microchurchResponse);
        },
        onError: (error) => {
            // handle error
            console.error("Error adding microchurch:", error);
        },
    });
}

export const useGetMicrochurchById = (id: number) => {
    return useQuery<TMicrochurch>({
        queryKey: [queryKeys.MICROCHURCH_DETAIL_KEY, id],
        queryFn: async () => {
            const { data } = await apiClient.getMicroChurch(id);
            return data.data;
        }
    });
}