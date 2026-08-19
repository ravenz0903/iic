import axios from 'axios';

// 10.0.2.2 is the localhost alias for Android Emulators
const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
