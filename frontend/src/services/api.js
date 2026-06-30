import { supabase } from '../utils/supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5002/api';

/**
 * Helper to execute fetch requests and handle common error responses.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Fetch active Supabase session to get the latest JWT token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_) {
      // JSON parsing failed, keep default status error message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  /**
   * Fetches the current user's profile (including role from DB).
   */
  getMe: () => request('/auth/me'),

  /**
   * Triggers script generation.
   * @param {Object} data - Form values
   */
  generateScript: (data) => request('/generate', {
    method: 'POST',
    body: data,
  }),

  /**
   * Retrieves full history of generations with optional search and filters.
   */
  getHistory: (page = 1, limit = 20, search = '', filters = {}) => {
    let query = `/history?page=${page}&limit=${limit}`;
    if (search && search.trim()) {
      query += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (filters.dateRange) {
      query += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
    }
    if (filters.rating) {
      query += `&rating=${filters.rating}`;
    }
    if (filters.vehicleType) {
      query += `&vehicleType=${encodeURIComponent(filters.vehicleType)}`;
    }
    return request(query);
  },

  /**
   * Retrieves detailed script generation by ID.
   */
  getGenerationById: (id) => request(`/history/${id}`),

  /**
   * Submits feedback for a generated script.
   * @param {Object} data - { generation_id, rating, comment }
   */
  submitFeedback: (data) => request('/feedback', {
    method: 'POST',
    body: data,
  }),

  /**
   * Retrieves aggregated analytics.
   */
  getAnalytics: () => request('/admin/analytics'),

  /**
   * Retrieves all templates/presets.
   */
  getTemplates: () => request('/templates'),

  /**
   * Creates a new template.
   */
  createTemplate: (data) => request('/templates', {
    method: 'POST',
    body: data,
  }),

  /**
   * Deletes a template by ID.
   */
  deleteTemplate: (id) => request(`/templates/${id}`, {
    method: 'DELETE',
  }),
};
