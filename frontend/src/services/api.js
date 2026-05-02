import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Axios Request Interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const category = localStorage.getItem('serviceType');
        if (category && !config.params?.category) {
            config.params = { ...config.params, category };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios Response Interceptor (for global error handling if needed)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// City and Search Services
export const getCities = () => API.get('/cities');
export const getSalons = (params) => API.get('/salons', { params });
export const getRecommendedSalons = () => API.get('/salons/recommended');
export const getTopRatedSalons = () => API.get('/salons/top-rated');
export const getSearchSuggestions = (q, city) => API.get('/salons/suggestions', { params: { q, city } });

export default API;
