import { useQuery, useMutation } from "react-query";
import { TFilterType } from "../types/member";
import { TServiceInfo, TServiceResponse, TServiceType } from "../types/service";
import * as apiClient from '../services/Service';
import * as queryKeys from '../constants/QueryKeys';

const _addServiceRequest = async (service: any) => {
    const { data } = await apiClient.addService(service)
    return data;
};

const _getServiceTypes = async () => {
    const { data } = await apiClient.getServiceTypes()
    return data.data
}

const _getServices = async (filter? : TFilterType) => {
    const { data } = await apiClient.getServices(filter)
    return data.data
}

const _getServiceAverageAttnAndOffering = async (filter? : TFilterType) => {
    const { data } = await apiClient.getServiceAverageAttnAndOffering(filter)
    return data.data
}

export const useGetServiceTypes = (filter?: TFilterType) => {
    return useQuery<TServiceType[]>({
            queryKey: [queryKeys.SERVICE_TYPE_LIST_KEY, filter],
            queryFn: async () => {
                return await _getServiceTypes();
            }
        })
}

export const useAddService = () => {
    return useMutation(async (serviceInfo: TServiceInfo) => _addServiceRequest(serviceInfo), {
            onSuccess: (serviceResponse) => {
                // invalidate the query cache for 'churches'
    
                console.log("response from adding service", serviceResponse)
    
                // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
            },
            onError: (error) => {
                // handle error
            },
        });
    };

export const useGetServices = (filter?: TFilterType) => {


    let serviceFilter = filter ? (('stream_id' in filter) ? filter['stream_id'] : filter) : {};

    console.log("Service Filter::", serviceFilter)

    return useQuery<TServiceResponse[]>({
            
            queryKey: [queryKeys.SERVICE_LIST_KEY, JSON.stringify(serviceFilter)],
            queryFn: async () => {
                return await _getServices(filter);
            }
        })
}

export const useGetServiceAverageAttnAndOffering = (filter?: TFilterType) => {

    return useQuery<{avgAttn: number, avgOffering: number}>({
            
            queryKey: [queryKeys.SERVICE_LIST_KEY, JSON.stringify(filter)],
            queryFn: async () => {
                return await _getServiceAverageAttnAndOffering(filter);
            }
        });
}