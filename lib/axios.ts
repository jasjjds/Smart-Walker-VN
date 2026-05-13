// File: lib/axiosClient.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ' https://breeze-fencing-elaborate.ngrok-free.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor cho Request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor cho Response
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về trực tiếp data bên trong response
    return response.data;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosClient;