import axios from 'axios';

const api = axios.create({
  // Make sure it is exactly http, not https, and includes your exact IP and port
  baseURL: 'http://10.108.98.115:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
