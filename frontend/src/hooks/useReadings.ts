import { useState, useEffect, useCallback } from 'react';
import { getLatest } from '../services/readingsService';

export const useReadings = () => {
  const [latestReading, setLatestReading] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLatest();
      // Backend returns { success, reading: { tds, timestamp, qualityScore, qualityStatus, ... } }
      setLatestReading(data?.reading || null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch latest reading';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return { latestReading, isLoading, error, refresh: fetchLatest };
};
