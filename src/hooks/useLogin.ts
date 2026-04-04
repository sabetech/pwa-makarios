import { useMutation } from 'react-query';
import { loginUser, LoginResponse } from '../api/auth';

export const useLogin = () => {
    return useMutation(loginUser, {
        onSuccess: (data: LoginResponse) => {
            // Store token and user data from the nested 'data' object
            console.log('Login successful:', data);
            if (data.success && data.data) {
                const { token, user } = data.data;
                localStorage.setItem('token', token);
                
                // Map the first role and its permissions for convenience
                const role = user.roles?.[0]?.name || 'User';
                const permissions = user.roles?.[0]?.permissions?.map(p => p.name) || [];
                
                const userToStore = {
                    ...user,
                    role,
                    permissions
                };
                
                localStorage.setItem('user', JSON.stringify(userToStore));
            }
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
        },
    });
};
