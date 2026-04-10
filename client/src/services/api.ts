import axios from 'axios';
import { getApiUrl } from '../config/env';

// Function to get API URL (called each time to ensure fresh value)
const getApiBaseUrl = (): string => {
    const url = getApiUrl();
    // Force replace port 5000 with 3002 if present
    if (url.includes(':5000')) {
        const correctedUrl = url.replace(':5000', ':3002');
        console.warn('Port 5000 detected in API URL, correcting to:', correctedUrl);
        return correctedUrl;
    }
    return url;
};

// Get API URL and log it for debugging
const apiUrl = getApiBaseUrl();
console.log('API Base URL:', apiUrl);
console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL);

const isDev = import.meta.env.DEV;
const pendingControllers = new Set<AbortController>();

const buildRequestKey = (config: any): string => {
    const method = (config.method || 'get').toUpperCase();
    const base = config.baseURL || '';
    const url = config.url || '';
    return `${method}::${base}${url}`;
};

export const cancelAllApiRequests = (): void => {
    pendingControllers.forEach((controller) => controller.abort());
    pendingControllers.clear();
};

// Create axios instance
const api = axios.create({
    baseURL: apiUrl,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth token and URL correction
api.interceptors.request.use(
    (config) => {
        // Attach abort signal to every request so route changes can cancel in-flight calls.
        const controller = new AbortController();
        config.signal = controller.signal;
        (config as any).__abortController = controller;
        pendingControllers.add(controller);

        // Fix port 5000 to 3002 if present in the URL (multiple checks)
        const originalUrl = config.url || '';
        const originalBaseURL = config.baseURL || '';
        
        if (originalUrl.includes(':5000')) {
            config.url = originalUrl.replace(':5000', ':3002');
            console.warn('🔧 Fixed port 5000 in request URL:', originalUrl, '→', config.url);
        }
        if (originalBaseURL.includes(':5000')) {
            config.baseURL = originalBaseURL.replace(':5000', ':3002');
            console.warn('🔧 Fixed port 5000 in baseURL:', originalBaseURL, '→', config.baseURL);
        }
        
        // Also check the full URL that will be used
        const fullUrl = (config.baseURL || '') + (config.url || '');
        if (fullUrl.includes(':5000')) {
            const correctedFullUrl = fullUrl.replace(':5000', ':3002');
            console.warn('🔧 Full URL contains port 5000:', fullUrl);
            console.warn('🔧 Corrected full URL:', correctedFullUrl);
            // Reconstruct baseURL and url from corrected full URL
            if (config.baseURL) {
                config.baseURL = config.baseURL.replace(':5000', ':3002');
            }
            if (config.url) {
                config.url = config.url.replace(':5000', ':3002');
            }
        }
        
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (isDev) {
            console.log('📡 Making request to:', (config.baseURL || '') + (config.url || ''));
        }
        (config as any).__requestKey = buildRequestKey(config);
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        const controller = (response.config as any).__abortController as AbortController | undefined;
        if (controller) {
            pendingControllers.delete(controller);
        }
        return response;
    },
    (error) => {
        const controller = error?.config?.__abortController as AbortController | undefined;
        if (controller) {
            pendingControllers.delete(controller);
        }

        const isCanceled = error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError';
        if (!isCanceled) {
            const status = error?.response?.status ?? 'NO_RESPONSE';
            const message = error?.message ?? 'Unknown error';
            const requestUrl = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
            console.error('API request failed:', { message, status, url: requestUrl });
        }

        if (error.response && error.response.status === 401) {
            // Handle unauthorized access - clear tokens and redirect to login
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            localStorage.removeItem('admin_refresh_token');
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
