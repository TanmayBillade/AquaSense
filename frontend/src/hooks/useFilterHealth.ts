import { useState, useEffect, useCallback } from 'react';
import { getFilterHealth } from '../services/analyticsService';

export const useFilterHealth = () => {
  const [filterHealth, setFilterHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFilterHealth();
      // Backend returns { success, filterHealth: { healthPercent, estimatedDays, status } }
      setFilterHealth(data?.filterHealth || null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch filter health';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { filterHealth, isLoading, error, refresh: fetchData };
};
