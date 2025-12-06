import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Get auth header with JWT token
export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'Authorization': 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async register(userData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/login', { 
      email, 
      password
    });
    return response.data;
  },

  async getProfile(token) {
    const response = await api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  },

  async updateProfile(token, userData) {
    const response = await api.put('/profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async logout(token) {
    const response = await api.post('/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
