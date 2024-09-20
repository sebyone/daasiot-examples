import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
/*
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export const axiosAuthInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let cachedToken: string | null = null;
let tokenExpirationTime: number | null = null;

const getAccessToken = async (): Promise<string | null> => {
  if (cachedToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return cachedToken;
  }

  const session = await getSession();
  if (session?.user?.access_token) {
    cachedToken = session.user.access_token;
    tokenExpirationTime = Date.now() + 3600000;
    return cachedToken;
  }

  return null;
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );
    const { access_token } = response.data;
    cachedToken = access_token;
    tokenExpirationTime = Date.now() + 3600000;
    return access_token;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return null;
  }
};

axiosAuthInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosAuthInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshAccessToken()
          .then((newToken) => {
            if (newToken) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              processQueue(null, newToken);
              resolve(axiosAuthInstance(originalRequest));
            } else {
              processQueue(new Error('Failed to refresh token'));
              signOut({ callbackUrl: '/' });
              reject(error);
            }
          })
          .catch((refreshError) => {
            processQueue(refreshError);
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default axiosAuthInstance;*/
