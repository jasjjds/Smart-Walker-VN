import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Clean leading/trailing spaces from environment variables
const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'https://weak-ants-wait.loca.lt/api').trim();

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'bypass-tunnel-reminder': 'true',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

// Interceptor cho Request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm Bearer Token vào header nếu có
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor cho Response
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về trực tiếp phần body data
    return response.data;
  },
  (error: any) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Tự động chuyển hướng về trang đăng nhập nếu token hết hạn (401)
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      document.cookie = 'userRole=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;