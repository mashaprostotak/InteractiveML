import axios from 'axios';

export const BASE_URL = import.meta.env.PROD
  ? `http://be.${window.location.hostname}/api`
  : 'http://localhost:8000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
