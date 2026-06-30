import { useState, useCallback } from 'react';
import { api } from '../services/api';

const DEFAULT_PAGE_LIMIT = 20;

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination details
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistory = useCallback(async (pageToFetch = 1, search = '', filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getHistory(pageToFetch, DEFAULT_PAGE_LIMIT, search, filters);
      setHistory(response.data || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
      setTotalPages(Math.ceil((response.total || 0) / (response.limit || 10)));
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError(err.message || 'Failed to retrieve history logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    history,
    loading,
    error,
    page,
    total,
    totalPages,
    fetchHistory,
    setHistory
  };
};
