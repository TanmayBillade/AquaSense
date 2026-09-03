import { useState, useEffect, useCallback } from 'react';
import { getPrediction } from '../services/analyticsService';

export const usePrediction = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPrediction();
      // Backend returns { success, prediction: { tomorrow, nextWeek, trend, trendData } }
      setPrediction(data?.prediction || null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch prediction';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { prediction, isLoading, error, refresh: fetchData };
};
