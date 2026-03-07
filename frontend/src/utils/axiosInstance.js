// Pre-configured axios instance that attaches the JWT from localStorage on every request.
// This replaces per-file { withCredentials: true } and ensures auth works on mobile browsers
// that block third-party cookies in cross-origin setups (Vercel frontend ↔ Render backend).

import axios from 'axios';

const api = axios.create({
    withCredentials: true,  // Keep cookie fallback for backward compatibility
});

// Attach Bearer token from localStorage before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
