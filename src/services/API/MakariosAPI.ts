import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_BASE_URL

import { useAuthToken } from '../../hooks/AuthHooks';

const postWithFile = (url: string, data: any, headers: object) => {
    const formData = new FormData();
    const authToken = useAuthToken();

    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    
    return axios(API_BASE_URL+url, {
         method: 'POST',
         headers: {
            'Content-Type': '"multipart/form-data"',
            'Authorization': `Bearer ${authToken}`,
           ...headers,
         },
         data: formData
       });
}

// const uploadToCloudinary = (data: any) => {
//     const formData = new FormData();

//     Object.keys(data).forEach(key => {
//         formData.append(key, data[key]);
//     });

//     return axios(CLOUDINARY_URL, {
//         method: 'POST',
//         headers: {
//            'Content-Type': '"multipart/form-data"',
//         },
//         data: formData
//       });
// }

const post = (url: string, data: any, headers: object) => {
    const authToken = useAuthToken();
    
    const formData = new FormData();

    Object.keys(data).forEach(key => {

        if (typeof data[key] === 'object' ) {
            data[key] = JSON.stringify(data[key]);
        }

        formData.append(key, data[key]);
    });

    return axios(API_BASE_URL+url, {
         method: 'POST',
         headers: {
            'Content-Type': '"application/json"',
            'Authorization': `Bearer ${authToken}`,
           ...headers,
         },
         data: formData
       });
}

const get = (url: string, headers: object) => {
    const authToken = useAuthToken();

    return axios(API_BASE_URL+url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...headers,
        },
    });
}

const deleteRequest = (url: string, headers: object) => {
    const authToken = useAuthToken();

    return axios(API_BASE_URL+url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...headers,
        },
    });
}

const put = (url: string, data: any, headers: object) => {
    const authToken = useAuthToken();

    return axios(API_BASE_URL+url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...headers,
        },
        data: data
    });
}

const auth = (url: string, data: any, headers: object) => {
    return axios(API_BASE_URL+url, {
        method: 'POST',
        headers: {
            'Content-Type': '"application/json"',
            'Accept': 'application/json',
            ...headers,
        },
        data: JSON.stringify(data)
    });
}

export { postWithFile, post, get, deleteRequest, put, auth };



