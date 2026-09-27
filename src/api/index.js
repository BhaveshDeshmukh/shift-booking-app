import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const fetchShifts = async () => {
  const response = await axios.get(`${API_BASE}/shifts`);
  return response.data;
};

export const bookShift = async (id) => {
  const response = await axios.post(`${API_BASE}/shifts/${id}/book`);
  return response.data;
};

export const cancelShift = async (id) => {
  const response = await axios.post(`${API_BASE}/shifts/${id}/cancel`);
  return response.data;
};