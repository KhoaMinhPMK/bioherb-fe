import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: inject Bearer token ───────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sankit_access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (err) => Promise.reject(err),
);

// ─── Response interceptor: auto-refresh on 401 ──────────────
let _isRefreshing = false;
let _pendingQueue = [];

function flushQueue(err, token) {
    _pendingQueue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token)));
    _pendingQueue = [];
}

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retried) {
            original._retried = true;

            if (_isRefreshing) {
                return new Promise((resolve, reject) => _pendingQueue.push({ resolve, reject })).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return api(original);
                });
            }

            _isRefreshing = true;
            const refreshToken = localStorage.getItem('sankit_refresh_token');

            if (!refreshToken) {
                _isRefreshing = false;
                window.dispatchEvent(new Event('sankit:logout'));
                return Promise.reject(err);
            }

            try {
                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
                localStorage.setItem('sankit_access_token', data.accessToken);
                if (data.refreshToken) localStorage.setItem('sankit_refresh_token', data.refreshToken);
                flushQueue(null, data.accessToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch (refreshErr) {
                flushQueue(refreshErr, null);
                localStorage.removeItem('sankit_access_token');
                localStorage.removeItem('sankit_refresh_token');
                window.dispatchEvent(new Event('sankit:logout'));
                return Promise.reject(refreshErr);
            } finally {
                _isRefreshing = false;
            }
        }
        return Promise.reject(err);
    },
);

export default api;
