import axios from 'axios';
import { Candidate } from '@/config/candidates';

const API_URL = 'http://localhost:5001/api';

// Get all candidates
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await axios.get(`${API_URL}/candidates`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch candidates');
    }
    throw error;
  }
};

// Vote for a candidate
export const voteForCandidate = async (candidateId: string, userId: string): Promise<Candidate> => {
  try {
    const response = await axios.post(`${API_URL}/candidates/${candidateId}/vote`, { userId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to vote');
    }
    throw error;
  }
};

// Get election results
export const getElectionResults = async () => {
  try {
    const response = await axios.get(`${API_URL}/results`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch results');
    }
    throw error;
  }
};

// Get candidate by ID
export const getCandidateById = async (id: string): Promise<Candidate> => {
  const candidates = getDefaultCandidates();
  const candidate = candidates.find(c => c.id === id);
  
  if (!candidate) {
    throw new Error('Candidate not found');
  }
  
  return candidate;
};
