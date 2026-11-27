import axios from 'axios';
import { endGhost, isGhosting } from '../utils/authStorage';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// A ghost token is short-lived. When it expires, fall back to the admin's
// own session instead of leaving the app stuck on 401s.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && isGhosting()) {
            endGhost();
            window.location.assign('/dashboard');
        }
        return Promise.reject(error);
    }
);

export default api;
