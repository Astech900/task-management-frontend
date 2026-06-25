import { useState, useCallback } from 'react';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from '../services/api';

interface UseAxiosResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config: AxiosRequestConfig) => Promise<T | null>;
}

export const useAxios = <T = any>(): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (config: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: AxiosResponse = await api(config);
      // Our backend always returns { status: 'success', data: { ... } }
      const responseData = response.data?.data || response.data;
      setData(responseData);
      return responseData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err; // Re-throw so components can catch if needed (e.g., for redirecting)
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};

export default useAxios;
