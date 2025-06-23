import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing API data with loading, error, and refresh states
 * @param {Function} fetchFunction - The API function to call
 * @param {boolean} autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} Object containing data, loading, error states and refresh function
 */
export const useApiData = (fetchFunction, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const optimisticUpdate = useCallback((updater) => {
    setData(prevData => {
      if (typeof updater === 'function') {
        return updater(prevData);
      }
      return updater;
    });
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    optimisticUpdate
  };
};

/**
 * Custom hook for managing API mutations (create, update, delete)
 * @param {Function} mutationFunction - The API mutation function
 * @returns {Object} Object containing mutation state and functions
 */
export const useApiMutation = (mutationFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      console.error('Mutation error:', err);
      setError(err.message || 'Mutation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset
  };
}; 