import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Member';
import * as queryKeys from '../constants/QueryKeys';
import { TMember, TMemberRequest, TFilterType } from '../types/member';

const _addMember = async (member: TMemberRequest) => {
    
    const { data } = await apiClient.addMember(member)
    return data;
  };

const _getMembers = async (filter? : TFilterType) => {
    
    const { data } = await apiClient.getMembers(filter)
    return data.data
}

export const useAddMember = () => {
    
    return useMutation(async (member: TMemberRequest) => _addMember(member), {
        onSuccess: (memberResponse) => {
            // invalidate the query cache for 'churches'

            console.log("response ", memberResponse)

            // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
        },
        onError: (error) => {
            // handle error
        },
    });
}

export const useGetMembers = (filter?: TFilterType) => {
    console.log("json filter::", JSON.stringify(filter))
    return  useQuery<TMember[]>( 
        { 
            queryKey: [queryKeys.MEMBER_LIST_KEY, JSON.stringify(filter)],
            queryFn: async () => {
                return await _getMembers(filter)
            },
        })
}
