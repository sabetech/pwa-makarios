import { useMutation, useQuery } from "react-query"
import { TArrivalForm, TArrivalData } from "../types/arrivals"
import * as apiClient from '../services/Arrivals';
import * as queryKeys from '../constants/QueryKeys';

const _addArrivalReport = async (arrivalForm: TArrivalForm) => {
    
    const { data } = await apiClient.addArrivalReport(arrivalForm)
    return data;
}

export const useAddArrivalReport = () => {
    return useMutation(async (arrivalForm: TArrivalForm) => _addArrivalReport(arrivalForm), {
        onSuccess: (arrivalResponse) => {
            // invalidate the query cache for 'churches'
    
            console.log("response ", arrivalResponse)
    
            // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
        },
        onError: (error) => {
            // handle error
        },
    })
}

export const _getArrivalReport = async () => {
    const { data } = await apiClient.getArrivalReport()
    return data.data
}

export const useGetArrivalReport = () => {
    return useQuery<TArrivalData>(
        {
            queryKey: [queryKeys.ARRIVAL_LIST_KEY],
            queryFn: async () => {
                return await _getArrivalReport()
            }
        }
    )
}