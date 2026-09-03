import { useState, useEffect, useCallback } from 'react';
import { getAlerts, markAlertRead as markAlertReadApi } from '../services/analyticsService';

export interface AlertType {
  _id: string;
  type: 'tds_high' | 'rapid_increase' | 'filter_warning' | 'connection_lost';
  message: string;
  tdsValue?: number;
  threshold?: number;
  read: boolean;
  createdAt: string;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchAlerts = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAlerts(params);
      // Backend returns { success, alerts: [...], unreadCount, totalCount, ... }
      const list = Array.isArray(data?.alerts) ? data.alerts : [];
      setAlerts(list);
      setUnreadCount(data?.unreadCount ?? list.filter((a: AlertType) => !a.read).length);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch alerts';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await markAlertReadApi(id);
      setAlerts(prev => {
        const updated = prev.map(a => a._id === id ? { ...a, read: true } : a);
        setUnreadCount(updated.filter(a => !a.read).length);
        return updated;
      });
    } catch (err: any) {
      console.error('Failed to mark alert as read', err);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, isLoading, error, unreadCount, refresh: fetchAlerts, markRead };
};
