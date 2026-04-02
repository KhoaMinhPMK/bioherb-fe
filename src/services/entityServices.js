/**
 * Entity service helpers — thin wrappers around the API axios instance.
 * All paginated list endpoints use limit=200 to return all data at once
 * (mirrors the previous mock-data behavior).
 */
import api from './api';

const LIST_PARAMS = { page: 1, limit: 200 };

// ─── Auth ────────────────────────────────────────────────────
export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// ─── Cooperatives ────────────────────────────────────────────
export const cooperativeService = {
    getAll: (params = {}) => api.get('/cooperatives', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/cooperatives/${id}`),
    create: (data) => api.post('/cooperatives', data),
    update: (id, data) => api.put(`/cooperatives/${id}`, data),
    delete: (id) => api.delete(`/cooperatives/${id}`),
};

// ─── Farms ───────────────────────────────────────────────────
export const farmService = {
    getAll: (params = {}) => api.get('/farms', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/farms/${id}`),
    create: (data) => api.post('/farms', data),
    update: (id, data) => api.put(`/farms/${id}`, data),
    delete: (id) => api.delete(`/farms/${id}`),
};

// ─── Plots ───────────────────────────────────────────────────
export const plotService = {
    getAll: (params = {}) => api.get('/plots', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/plots/${id}`),
    create: (data) => api.post('/plots', data),
    update: (id, data) => api.put(`/plots/${id}`, data),
    delete: (id) => api.delete(`/plots/${id}`),
};

// ─── Crop Cycles ─────────────────────────────────────────────
export const cropCycleService = {
    getAll: (params = {}) => api.get('/crop-cycles', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/crop-cycles/${id}`),
    create: (data) => api.post('/crop-cycles', data),
    update: (id, data) => api.put(`/crop-cycles/${id}`, data),
    delete: (id) => api.delete(`/crop-cycles/${id}`),
};

// ─── Task Plans ──────────────────────────────────────────────
export const taskPlanService = {
    getAll: (params = {}) => api.get('/task-plans', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/task-plans/${id}`),
    create: (data) => api.post('/task-plans', data),
    update: (id, data) => api.put(`/task-plans/${id}`, data),
    delete: (id) => api.delete(`/task-plans/${id}`),
};

// ─── Task Logs ───────────────────────────────────────────────
export const taskLogService = {
    getAll: (params = {}) => api.get('/task-logs', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/task-logs/${id}`),
    create: (data) => api.post('/task-logs', data),
    update: (id, data) => api.put(`/task-logs/${id}`, data),
    submit: (id) => api.patch(`/task-logs/${id}/submit`),
    approve: (id) => api.patch(`/task-logs/${id}/approve`),
    reject: (id) => api.patch(`/task-logs/${id}/reject`),
    delete: (id) => api.delete(`/task-logs/${id}`),
};

// ─── Workers ─────────────────────────────────────────────────
export const workerService = {
    getAll: (params = {}) => api.get('/workers', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/workers/${id}`),
    create: (data) => api.post('/workers', data),
    update: (id, data) => api.put(`/workers/${id}`, data),
    delete: (id) => api.delete(`/workers/${id}`),
};

// ─── Equipment ───────────────────────────────────────────────
export const equipmentService = {
    getAll: (params = {}) => api.get('/equipment', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (data) => api.post('/equipment', data),
    update: (id, data) => api.put(`/equipment/${id}`, data),
    delete: (id) => api.delete(`/equipment/${id}`),
};

// ─── Input Items ─────────────────────────────────────────────
export const inputItemService = {
    getAll: (params = {}) => api.get('/input-items', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/input-items/${id}`),
    create: (data) => api.post('/input-items', data),
    update: (id, data) => api.put(`/input-items/${id}`, data),
    delete: (id) => api.delete(`/input-items/${id}`),
};

// ─── Harvest ─────────────────────────────────────────────────
export const harvestService = {
    getAll: (params = {}) => api.get('/harvest', { params: { ...LIST_PARAMS, ...params } }),
    getById: (id) => api.get(`/harvest/${id}`),
    create: (data) => api.post('/harvest', data),
    update: (id, data) => api.put(`/harvest/${id}`, data),
    delete: (id) => api.delete(`/harvest/${id}`),
};
