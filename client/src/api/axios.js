import axios from 'axios';

// Automatically points to VITE_API_URL if it exists (e.g. deployed Render URL),
// or gracefully defaults to standard relative proxying paths inside localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default api;
