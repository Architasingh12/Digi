import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Portal specific services
export const portalServices = {
    // Participant Management (Admin)
    getParticipants: () => api.get('/participants'),
    createParticipant: (data) => api.post('/participants', data),
    deleteParticipant: (id) => api.delete(`/participants/${id}`),

    // Company Management (Admin)
    getCompanies: () => api.get('/companies'),
    createCompany: (data) => api.post('/companies', data),
    updateCompany: (id, data) => api.put(`/companies/${id}`, data),
    deleteCompany: (id) => api.delete(`/companies/${id}`),

    // Assessment Results
    saveAssessment: (data) => api.post('/assessments/save', data),
    getParticipantAssessments: (id) => api.get(`/assessments/participant/${id}`),
    getAssessmentDetail: (id) => api.get(`/assessments/${id}`),
    getAssessments: () => api.get('/assessments'),
};

export default api;
