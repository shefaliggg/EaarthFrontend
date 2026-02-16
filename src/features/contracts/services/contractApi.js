import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for auth tokens)
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

const contractApi = {
  // Get all contracts
  async getContracts(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const response = await api.get(`/contracts?${queryParams.toString()}`);
    return response.data.data;
  },

  // Get single contract
  async getContract(id) {
    const response = await api.get(`/contracts/${id}`);
    return response.data.data;
  },

  // Create contract
  async createContract(data) {
    const response = await api.post('/contracts', data);
    return response.data.data;
  },

  // Update contract
  async updateContract(id, data) {
    const response = await api.put(`/contracts/${id}`, data);
    return response.data.data;
  },

  // Delete contract
  async deleteContract(id) {
    const response = await api.delete(`/contracts/${id}`);
    return response.data.data;
  },

  // NEW: Generate HTML preview
  async generatePreview(contractData) {
    const response = await api.post('/contracts/preview', contractData);
    return response.data.html;
  },

  // Download PDF as blob
  async downloadPDF(id) {
    try {
      const response = await api.get(`/contracts/${id}/download`, {
        responseType: 'blob',
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to download PDF:', error);
      throw error;
    }
  },

  // Add signature
  async addSignature(id, signatureData) {
    const response = await api.post(`/contracts/${id}/signatures`, signatureData);
    return response.data.data;
  },

  // Preview HTML (for development/debugging)
  async previewHTML(id) {
    const response = await api.get(`/contracts/${id}/preview`);
    return response.data;
  },

  // Get contract stats
  async getStats(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const response = await api.get(`/contracts/stats?${queryParams.toString()}`);
    return response.data.data;
  },
};

export default contractApi;