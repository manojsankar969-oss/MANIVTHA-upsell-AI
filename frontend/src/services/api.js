const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

/**
 * Helper to execute fetch requests and handle common error responses.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

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
   * Triggers script generation.
   * @param {Object} data - { staff_name, customer_details, booking_inputs }
   */
  generateScript: (data) => request('/generate', {
    method: 'POST',
    body: data,
  }),

  /**
   * Retrieves full history of generations.
   */
  getHistory: () => request('/history'),

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
};
