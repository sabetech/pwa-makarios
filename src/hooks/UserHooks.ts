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
        
        console.log("User::", user);

        const { data } = await apiClient.addUser(user)
        return data;
    }, {
        onSuccess: (userResponse) => {
            
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

export const useAddRole = () => {
    return useMutation(async (role: TRole) => {
        
        console.log("Role::", role);

        const { data } = await apiClient.addRole(role)
        return data;
    }, {
        onSuccess: (roleResponse) => {
            
            console.log("response from adding role", roleResponse)
            // queryClient.invalidateQueries('roles');
        },
        onError: (error) => {
            // handle error
            console.error("Error adding role:", error);
        },
    });
}