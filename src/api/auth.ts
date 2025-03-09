import axios from 'axios';
import type { AxiosError } from 'axios';

const API_URL = 'http://localhost:5001/api';

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
    throw error;
  }
};

// Register user
export const registerUser = async (name: string, email: string, voterId: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      voterId,
      password
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
    throw error;
  }
};
