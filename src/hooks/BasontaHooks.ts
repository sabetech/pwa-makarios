import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../services/Basonta';
import * as queryKeys from '../constants/QueryKeys';
import { TBasonta } from '../types/basonta';


// const _addBacenta = async (council: TCouncil) => {
    
//     const { data } = await apiClient.addCouncil(council)
//     return data;
//   };

const _getBasontas = async () => {

    const { data } = await apiClient.getBasontas()
    return data.data
}

// export const useAddBacenta = () => {
    
//     return useMutation(async (council: TCouncil) => _addBacenta(council), {
//         onSuccess: (councilResponse) => {
//             // invalidate the query cache for 'churches'

//             console.log("response ", councilResponse)

//             // queryClient.invalidateQueries(CHURCH_LIST_QUERY_KEY);
//         },
//         onError: (error) => {
//             // handle error
//         },
//     });
// }

export const useGetBasontas = () => {
    return  useQuery<TBasonta[]>( 
        { 
            queryKey: [queryKeys.BASONTA_LIST_KEY],
            queryFn: async () => {
                return await _getBasontas()
            },
        })
}