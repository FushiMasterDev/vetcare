// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/v1/auth/refresh`, null, {
          params: { refreshToken },
        });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; fullName: string; phone?: string }) =>
    api.post('/v1/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/v1/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post('/v1/auth/refresh', null, { params: { refreshToken } }),
};

// ─── Services ──────────────────────────────────────────────────────────────
export const servicesApi = {
  getAll: () => api.get('/v1/services'),
  getById: (id: number) => api.get(`/v1/services/${id}`),
  search: (keyword: string) => api.get('/v1/services/search', { params: { keyword } }),
  bySymptom: (symptom: string) => api.get('/v1/services/by-symptom', { params: { symptom } }),
  bySpecialization: (s: string) => api.get('/v1/services/by-specialization', { params: { specialization: s } }),
  getSpecializations: () => api.get('/v1/services/specializations'),
  create: (data: any) => api.post('/v1/services', data),
  update: (id: number, data: any) => api.put(`/v1/services/${id}`, data),
  delete: (id: number) => api.delete(`/v1/services/${id}`),
};

// ─── Doctors ───────────────────────────────────────────────────────────────
export const doctorsApi = {
  getAll: () => api.get('/v1/doctors'),
  getById: (id: number) => api.get(`/v1/doctors/${id}`),
  byBranch: (branchId: number) => api.get(`/v1/doctors/by-branch/${branchId}`),
  byService: (serviceId: number) => api.get(`/v1/doctors/by-service/${serviceId}`),
  search: (keyword: string) => api.get('/v1/doctors/search', { params: { keyword } }),
  create: (data: any) => api.post('/v1/doctors', data),
  update: (id: number, data: any) => api.put(`/v1/doctors/${id}`, data),
  delete: (id: number) => api.delete(`/v1/doctors/${id}`),
};

// ─── Branches ──────────────────────────────────────────────────────────────
export const branchesApi = {
  getAll: () => api.get('/v1/branches'),
  getById: (id: number) => api.get(`/v1/branches/${id}`),
  create: (data: any) => api.post('/v1/branches', data),
  update: (id: number, data: any) => api.put(`/v1/branches/${id}`, data),
  delete: (id: number) => api.delete(`/v1/branches/${id}`),
};

// ─── Appointments ──────────────────────────────────────────────────────────
export const appointmentsApi = {
  create: (data: any) => api.post('/v1/appointments', data),
  getMy: () => api.get('/v1/appointments/my'),
  getAll: () => api.get('/v1/appointments'),
  getById: (id: number) => api.get(`/v1/appointments/${id}`),
  updateStatus: (id: number, status: string, cancelReason?: string) =>
    api.patch(`/v1/appointments/${id}/status`, { status, cancelReason }),
  cancel: (id: number, reason: string) =>
    api.patch(`/v1/appointments/${id}/cancel`, { reason }),
};

// ─── Posts ─────────────────────────────────────────────────────────────────
export const postsApi = {
  getAll: () => api.get('/v1/posts'),
  getById: (id: number) => api.get(`/v1/posts/${id}`),
  search: (keyword: string) => api.get('/v1/posts/search', { params: { keyword } }),
  byCategory: (category: string) => api.get(`/v1/posts/category/${category}`),
  create: (data: any) => api.post('/v1/posts', data),
  update: (id: number, data: any) => api.put(`/v1/posts/${id}`, data),
  delete: (id: number) => api.delete(`/v1/posts/${id}`),
  toggleLike: (id: number) => api.post(`/v1/posts/${id}/like`),
  getComments: (id: number) => api.get(`/v1/posts/${id}/comments`),
  addComment: (id: number, data: { content: string; parentId?: number }) =>
    api.post(`/v1/posts/${id}/comments`, data),
  deleteComment: (commentId: number) => api.delete(`/v1/posts/comments/${commentId}`),
};

// ─── Reviews ───────────────────────────────────────────────────────────────
export const reviewsApi = {
  byService: (serviceId: number) => api.get(`/v1/reviews/service/${serviceId}`),
  byDoctor: (doctorId: number) => api.get(`/v1/reviews/doctor/${doctorId}`),
  create: (data: any) => api.post('/v1/reviews', data),
  delete: (id: number) => api.delete(`/v1/reviews/${id}`),
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/v1/admin/dashboard'),
  getUsers: () => api.get('/v1/admin/users'),
  toggleUserActive: (id: number) => api.patch(`/v1/admin/users/${id}/toggle-active`),
  getAllAppointments: () => api.get('/v1/admin/appointments'),
};

export default api;
