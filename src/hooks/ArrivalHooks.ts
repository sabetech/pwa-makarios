import { useMutation } from "react-query"
import { TArrivalForm } from "../types/arrivals"
import * as apiClient from '../services/Arrivals';

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