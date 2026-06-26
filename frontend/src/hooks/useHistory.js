import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Failed to fetch generation history.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
    setHistory
  };
};
