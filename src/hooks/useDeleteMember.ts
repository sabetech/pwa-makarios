import { useMutation, useQueryClient } from 'react-query';
import { deleteMember } from '../api/members';

export const useDeleteMember = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number | string>(
        (id) => deleteMember(id),
        {
            onSuccess: (_data, id) => {
                queryClient.invalidateQueries(['member', String(id)]);
                queryClient.invalidateQueries('members');
            },
        }
    );
};
