import { TFilterType } from "../types/generic"
import { TUser, TRole } from "../types/user"
import * as apiClient from '../services/UserManagement';
import { useMutation, useQuery } from 'react-query';
export const useGetUsers = (filter?: TFilterType) => {

    return useQuery<TUser[]>({
        queryKey: ['users', filter],
        queryFn: async () => {
            const { data } = await apiClient.getUsers(filter)
            return data.data
        }
    })

}


export const useAddUser = () => {
    return useMutation(async (user: TUser) => {
        const { data } = await apiClient.addUser(user)
        return data;
    }, {
        onSuccess: (userResponse) => {
            // Invalidate the query cache for 'users'
            console.log("response from adding user", userResponse)
            // queryClient.invalidateQueries('users');
        },
        onError: (error) => {
            // handle error
            console.error("Error adding user:", error);
        },
    });
}

export const useGetRoles = () => {
    return useQuery<TRole[]>({
        queryKey: ['roles'],
        queryFn: async () => {
            const { data } = await apiClient.getRoles()
            return data.data
        }
    })
}