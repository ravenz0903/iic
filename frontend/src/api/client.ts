import axios from 'axios';

const API_BASE = 'http://10.59.125.169:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
export { API_BASE };
