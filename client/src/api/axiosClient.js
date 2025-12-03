import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401/403 errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('businessModel');
                window.location.href = '/login';
            }
            
            // Handle 403 Forbidden - user doesn't have permission
            if (error.response.status === 403) {
                console.error('Access forbidden:', error.response.data.message);
                // Optionally redirect to their home page
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const { role } = JSON.parse(userInfo);
                    if (role === 'manufacturer') {
                        window.location.href = '/manufacturer/home';
                    } else if (role === 'distributor') {
                        window.location.href = '/distributor/home';
                    } else if (role === 'retailer') {
                        window.location.href = '/retailer/home';
                    } else if (role === 'candidate') {
                        window.location.href = '/candidate/home';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
