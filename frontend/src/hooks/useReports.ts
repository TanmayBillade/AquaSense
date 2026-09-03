import { useState, useEffect, useCallback } from 'react';
import { getWeeklyReports } from '../services/reportsService';

export interface ReportType {
  week: number;
  startDate: string;
  endDate: string;
  weekStart?: string;
  weekEnd?: string;
  avgTds: number;
  avgTDS?: number;
  maxTds: number;
  maxTDS?: number;
  minTds: number;
  minTDS?: number;
  medianTds: number;
  readingCount: number;
  qualityScore: number;
  trend: string;
  recommendation: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeeklyReports();
      // Backend returns { success, reports: [...] }
      const items = Array.isArray(data?.reports) ? data.reports : [];
      // Normalize field names for compatibility with components
      const normalized = items.map((r: any) => ({
        ...r,
        weekStart: r.weekStart || r.startDate,
        weekEnd: r.weekEnd || r.endDate,
        avgTDS: r.avgTDS ?? r.avgTds ?? 0,
        maxTDS: r.maxTDS ?? r.maxTds ?? 0,
        minTDS: r.minTDS ?? r.minTds ?? 0,
      }));
      setReports(normalized);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch reports';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, isLoading, error, refresh: fetchReports };
};
