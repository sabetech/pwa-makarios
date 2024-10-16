import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Member';
import * as queryKeys from '../constants/QueryKeys';
import { TMember, TMemberRequest } from '../types/member';

const _addMember = async (member: TMemberRequest) => {
    
    const { data } = await apiClient.addMember(member)
    return data;
  };

const _getMembers = async () => {

    const { data } = await apiClient.getMembers()
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

export const useGetMembers = () => {
    return  useQuery<TMember[]>( 
        { 
            queryKey: [queryKeys.MEMBER_LIST_KEY],
            queryFn: async () => {
                return await _getMembers()
            },
        })
}